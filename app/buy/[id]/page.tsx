import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface MyPropertyPageProps {
  params: { id: string };
}

function formatIndianNumber(x: number) {
  const s = x.toString();
  if (s.length <= 3) return s;
  const lastThree = s.slice(-3);
  const otherNumbers = s.slice(0, -3);
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
}

export default async function PropertyPage({ params }: MyPropertyPageProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property || !property.approved) return notFound();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-96 object-cover rounded-xl shadow"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
          <p className="text-gray-500 mb-4">{property.location}</p>

          <div className="space-y-2">
            <p>
              <strong>Type:</strong> {property.propertyType}
            </p>
            <p>
              <strong>Purpose:</strong> {property.purpose === "rent" ? "Rent" : "Sale"}
            </p>
            <p>
              <strong>Size:</strong> {formatIndianNumber(property.squareFeet)} sqft
            </p>
            <p>
              <strong>
                {property.purpose === "rent" ? "Rent:" : "Price:"}
              </strong>{" "}
              ৳{formatIndianNumber(property.priceOrRent)}
              {property.purpose === "rent" && " /month"}
            </p>
            <p>
              <strong>Contact:</strong> {property.submittedBy} ({property.phone})
            </p>
            <p>
              <strong>Email:</strong> {property.email}
            </p>
            <p className="mt-4">
              <strong>Description:</strong>
              <br />
              {property.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
