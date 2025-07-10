import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ToggleApprovalButton from "@/app/components/ToggleApprovalButton";



const PropertyDetailsPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

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

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600 mb-1">
              <strong>Location:</strong> {property.location}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Type:</strong> {property.propertyType}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Purpose:</strong> {property.purpose}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Square Feet:</strong> {property.squareFeet}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Price / Rent:</strong> ${property.priceOrRent}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {property.description}
            </p>

            <p className="text-sm text-gray-500">
              <strong>Submitted By:</strong> {property.submittedBy}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Email:</strong> {property.email}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Phone:</strong> {property.phone}
            </p>
          </div>

          {property.imageUrl && (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-auto max-h-96 object-cover rounded"
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Link href="/auth/dashboard">
            <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
              Back to Dashboard
            </button>
          </Link>

          <ToggleApprovalButton
            propertyId={property.id}
            action={property.approved ? "unapprove" : "approve"}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
