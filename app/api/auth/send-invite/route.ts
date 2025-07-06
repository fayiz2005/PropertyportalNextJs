import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// Ensure the token is unique in the database
async function generateUniqueToken(): Promise<string> {
  let token;
  let exists = true;

  while (exists) {
    token = generateToken();
    const existing = await prisma.invitation.findUnique({ where: { token } });
    if (!existing) exists = false;
  }

  return token;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ message: "Invalid email." }), { status: 400 });
    }

    const token = await generateUniqueToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // Upsert the invitation record (replaces old token if re-invited)
    await prisma.invitation.upsert({
      where: { email },
      update: { token, used: false, expiresAt },
      create: { email, token, expiresAt },
    });

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/set-password?token=${token}`;

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Panel" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "You're invited!",
      html: `
        <h2>You've been invited to join the Admin Panel</h2>
        <p>Click the link below to set your password and activate your account:</p>
        <a href="${link}">${link}</a>
        <p>This link will expire in 1 hour and can only be used once.</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Invite sent!" }), { status: 200 });

  } catch (error) {
    console.error("Send invite error:", error);
    return new Response(JSON.stringify({ message: "Failed to send invite." }), { status: 500 });
  }
}
