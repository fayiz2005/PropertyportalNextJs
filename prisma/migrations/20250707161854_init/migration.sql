-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "priceOrRent" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);
