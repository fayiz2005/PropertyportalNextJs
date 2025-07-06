import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  console.log("[reset-password] Request received. Token:", token);

  if (!token || !password) {
    console.log("[reset-password] Missing token or password");
    return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
  }

  const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetRecord) {
    console.log("[reset-password] Token not found in DB:", token);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  if (resetRecord.expires < new Date()) {
    console.log("[reset-password] Token expired:", token);
    return NextResponse.json({ error: "Token has expired" }, { status: 400 });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { hashedPassword: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    console.log("[reset-password] Password updated for:", resetRecord.email);
    return NextResponse.json({ message: "Password reset successful." });
  } catch (err) {
    console.error("[reset-password] Error updating password:", err);
    return NextResponse.json({ error: "Could not update password" }, { status: 500 });
  }
}
