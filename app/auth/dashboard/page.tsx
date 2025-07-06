import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import InviteAdminWrapper from "./InviteAdminWrapper";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (!user?.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">
          Email not verified.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="space-y-2">
          <p className="text-gray-700">
            Logged in as:{" "}
            <span className="font-medium text-gray-900">{session.user.email}</span>
          </p>
          <p className="text-gray-700">
            Role:{" "}
            <span className="font-medium text-blue-700">{session.user.role}</span>
          </p>
        </div>

        {session.user.role === "SUPERADMIN" && (
          <div>
            <InviteAdminWrapper />
          </div>
        )}

        <div className="pt-6">
          <Link href="/signout">
            <button className="ml-0 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition cursor-pointer">
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
