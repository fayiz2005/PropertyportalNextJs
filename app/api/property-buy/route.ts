import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const purpose = searchParams.get("purpose") || "sale";
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "100000000");
    const minArea = parseInt(searchParams.get("minArea") || "0");
    const maxArea = parseInt(searchParams.get("maxArea") || "10000");
    const propertyType = searchParams.get("type");
    const location = searchParams.get("location")?.toLowerCase();

    const properties = await prisma.property.findMany({
      where: {
        approved: true,
        purpose,
        priceOrRent: { gte: minPrice, lte: maxPrice },
        squareFeet: { gte: minArea, lte: maxArea },
        ...(propertyType && { propertyType }),
        ...(location && {
          location: {
            contains: location,
            mode: "insensitive",
          },
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Buy properties fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
