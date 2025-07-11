import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import InviteAdminWrapper from "./InviteAdminWrapper";
import { redirect } from "next/navigation";
import ToggleApprovalButton from "@/app/components/ToggleApprovalButton";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user?.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">Email not verified.</p>
      </div>
    );
  }

  const pendingProperties = await prisma.property.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
  });

  const approvedProperties = await prisma.property.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
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

        {/* Pending Properties */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-4">Pending Approval</h2>
          {pendingProperties.length === 0 ? (
            <p className="text-gray-500">No pending properties.</p>
          ) : (
            <ul className="space-y-4">
              {pendingProperties.map((property) => (
                <li key={property.id} className="p-4 border rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <Link href={`/auth/dashboard/property-details/${property.id}`}>
                      <p className="font-bold text-blue-700 hover:underline cursor-pointer">
                        {property.title}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <ToggleApprovalButton propertyId={property.id} action="approve" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Approved Properties */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Approved Properties</h2>
          {approvedProperties.length === 0 ? (
            <p className="text-gray-500">No approved properties.</p>
          ) : (
            <ul className="space-y-4">
              {approvedProperties.map((property) => (
                <li key={property.id} className="p-4 border rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <Link href={`/auth/dashboard/property-details/${property.id}`}>
                      <p className="font-bold text-blue-700 hover:underline cursor-pointer">
                        {property.title}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <ToggleApprovalButton propertyId={property.id} action="unapprove" />


                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-6">
          <Link href="/signout">
            <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
