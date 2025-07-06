import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Set-password request body:", body);

    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ message: "Invalid token or password." }, { status: 400 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: { token },
    });

    if (!invitation || invitation.used) {
      return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: invitation.email,
          hashedPassword,
          emailVerified: new Date(),
          role: "ADMIN",
        },
      }),
      prisma.invitation.update({
        where: { id: invitation.id }, // ✅ correct: `id` is unique
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ message: "Password set successfully!" });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
