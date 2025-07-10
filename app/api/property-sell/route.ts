import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      submitted_by,
      phone,
      email,
      title,
      description,
      property_type,
      location,
      square_feet,
      purpose,
      price_or_rent,
      imageUrl,
    } = body;

    if (
      !submitted_by ||
      !phone ||
      !email ||
      !title ||
      !description ||
      !property_type ||
      !location ||
      !square_feet ||
      !purpose ||
      !price_or_rent ||
      !imageUrl
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        submittedBy: submitted_by,
        phone,
        email,
        title,
        description,
        propertyType: property_type,
        location,
        squareFeet: parseInt(square_feet),
        purpose,
        priceOrRent: parseInt(price_or_rent),
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error) {
    console.error("Property submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
