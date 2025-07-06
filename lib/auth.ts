// lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", label: "Email", placeholder: "johndoe@gmail.com" },
        password: { type: "password", label: "Password", placeholder: "*****" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing fields");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const passwordValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!passwordValid) {
          throw new Error("Invalid credentials");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        console.log(" [authorize] user:", user);

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }

      console.log("[jwt] token:", token);

      return token;
    },

    async session({ session, token }) {
      console.log(" [session] token:", token);
      if (session.user) {
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      console.log(" [session] session:", session);
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};


export default NextAuth(authOptions);
