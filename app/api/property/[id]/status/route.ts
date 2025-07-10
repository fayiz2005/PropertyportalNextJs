import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  const propertyId = params.id;

  if (!["approve", "unapprove"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await prisma.property.update({
      where: { id: propertyId },
      data: { approved: status === "approve" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating property status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
