// app/buy/page.tsx
"use client";

import { useState, useEffect } from "react";
import bdLocations from "@/app/bd_locations.json";
import { useRouter } from "next/navigation";
import ReactSlider from "react-slider";

function formatIndianNumber(x: number) {
  const s = x.toString();
  if (s.length <= 3) return s;
  const lastThree = s.slice(-3);
  const otherNumbers = s.slice(0, -3);
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
}

function PropertyCard({ property }: { property: any }) {
  return (
    <div
      className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={() => window.location.href = `/buy/${property.id}`}
    >
      <img
        src={property.imageUrl}
        alt={property.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h5 className="font-semibold text-lg">{property.title}</h5>
        <p className="text-sm text-gray-500">{property.location}</p>
        <p className="text-sm text-gray-600">
          {property.propertyType} | {formatIndianNumber(property.squareFeet)} sqft
        </p>
        <p className="text-black font-medium">
          {property.purpose === "rent"
            ? `৳${formatIndianNumber(property.priceOrRent)} /month`
            : `৳${formatIndianNumber(property.priceOrRent)}`}
        </p>
      </div>
    </div>
  );
}

export default function BuyPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [purpose, setPurpose] = useState("sale");
  const [propertyType, setPropertyType] = useState("");
  const maxPrice = purpose === "rent" ? 150000 : 100000000;
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [areaRange, setAreaRange] = useState([0, 10000]);

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");

  useEffect(() => {
    fetch("/api/property-buy")
      .then(res => res.json())
      .then(data => {
        const approvedOnly = data.filter((p: any) => p.approved);
        setProperties(approvedOnly);
        setFiltered(approvedOnly);
      });
  }, []);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [purpose]);

  useEffect(() => {
    const filteredResults = properties.filter((p) => {
      const [minPrice, maxPriceVal] = priceRange;
      const [minArea, maxArea] = areaRange;

      const matchesPurpose = p.purpose === purpose;
      const matchesPrice = p.priceOrRent >= minPrice && p.priceOrRent <= maxPriceVal;
      const matchesArea = p.squareFeet >= minArea && p.squareFeet <= maxArea;
      const matchesType = propertyType ? p.propertyType === propertyType : true;

      const locLower = p.location.toLowerCase();
      const matchesDivision = division ? locLower.includes(division.toLowerCase()) : true;
      const matchesDistrict = district ? locLower.includes(district.toLowerCase()) : true;
      const matchesThana = thana ? locLower.includes(thana.toLowerCase()) : true;

      return (
        matchesPurpose &&
        matchesPrice &&
        matchesArea &&
        matchesType &&
        matchesDivision &&
        matchesDistrict &&
        matchesThana
      );
    });

    setFiltered(filteredResults);
  }, [purpose, priceRange, areaRange, division, district, thana, propertyType, properties]);

  const divisions = bdLocations.divisions.map((d: any) => d.name);
  const districts = division
    ? bdLocations.divisions.find((d: any) => d.name === division)?.districts.map((dist: any) => dist.name) || []
    : [];
  const thanas = division && district
    ? bdLocations.divisions.find((d: any) => d.name === division)?.districts.find((dist: any) => dist.name === district)?.upazilas.map((u: any) => typeof u === "string" ? u : u.name) || []
    : [];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Sidebar */}
      <div className="md:w-1/4 space-y-4">
        <h2 className="text-xl font-semibold">Filters</h2>

        {/* Purpose */}
        <div className="flex gap-2">
          {['sale', 'rent'].map((type) => (
            <button
              key={type}
              className={`px-4 py-1 rounded-full border ${purpose === type ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}`}
              onClick={() => setPurpose(type)}
            >
              {type === 'sale' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>

        {/* Property Type */}
        <select
          className="w-full border rounded-lg p-2"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Land">Land</option>
          <option value="Commercial">Commercial</option>
        </select>

      {/* Price Range Double Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range (৳)
        </label>
        <ReactSlider
          className="w-full flex items-center h-4 mb-2" // aligns thumbs and track
          thumbClassName="h-4 w-4 bg-black rounded-full cursor-pointer -mt-1" // vertically centers
          trackClassName="top-1/2 transform -translate-y-1/2 bg-gray-400 h-1"
          value={priceRange}
          min={0}
          max={maxPrice}
          step={purpose === "rent" ? 1000 : 50000}
          onChange={(val: number[] | number) => setPriceRange(val as number[])}
          pearling
          minDistance={purpose === "rent" ? 1000 : 50000}
        />
        <p className="text-sm text-gray-600">
          ৳{formatIndianNumber(priceRange[0])} — ৳{formatIndianNumber(priceRange[1])}
        </p>
      </div>

      {/* Area Range Double Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Square Feet
        </label>
        <ReactSlider
          className="w-full flex items-center h-4 mb-2"
          thumbClassName="h-4 w-4 bg-black rounded-full cursor-pointer -mt-1"
          trackClassName="top-1/2 transform -translate-y-1/2 bg-gray-400 h-1"
          value={areaRange}
          min={0}
          max={10000}
          step={50}
          onChange={(val: number[] | number) => setAreaRange(val as number[])}
          pearling
          minDistance={50}
        />
        <p className="text-sm text-gray-600">
          {formatIndianNumber(areaRange[0])} sqft — {formatIndianNumber(areaRange[1])} sqft
        </p>
      </div>



        {/* Location dropdowns */}
        <select
          className="w-full border rounded-lg p-2"
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            setDistrict("");
            setThana("");
          }}
        >
          <option value="">Select Division</option>
          {divisions.map((d) => <option key={d}>{d}</option>)}
        </select>

        <select
          className="w-full border rounded-lg p-2"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setThana("");
          }}
          disabled={!division}
        >
          <option value="">Select District</option>
          {districts.map((d) => <option key={d}>{d}</option>)}
        </select>

        <select
          className="w-full border rounded-lg p-2"
          value={thana}
          onChange={(e) => setThana(e.target.value)}
          disabled={!district}
        >
          <option value="">Select Thana</option>
          {thanas.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((p) => <PropertyCard key={p.id} property={p} />)
        ) : (
          <p className="col-span-full text-gray-500">No properties found.</p>
        )}
      </div>
    </div>
  );
}
