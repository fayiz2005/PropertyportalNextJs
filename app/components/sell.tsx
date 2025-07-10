"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import bdLocations from "../bd_locations.json";

interface FormData {
  submitted_by: string;
  phone: string;
  email: string;
  title: string;
  description: string;
  property_type: string;
  division: string;
  district: string;
  thana: string;
  square_feet: string;
  purpose: string;
  price_or_rent: string;
  image: File | null;
}

export default function PropertySellForm() {
  const [formData, setFormData] = useState<FormData>({
    submitted_by: "",
    phone: "",
    email: "",
    title: "",
    description: "",
    property_type: "",
    division: "",
    district: "",
    thana: "",
    square_feet: "",
    purpose: "",
    price_or_rent: "",
    image: null,
  });

  const [submitText, setSubmitText] = useState("Submit");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const divisions = bdLocations.divisions.map((div) => div.name);

  const districts =
    formData.division
      ? bdLocations.divisions.find((div) => div.name === formData.division)?.districts.map((dist) => dist.name) || []
      : [];

  const thanas =
    formData.division && formData.district
      ? (() => {
          const divisionObj = bdLocations.divisions.find((div) => div.name === formData.division);
          const districtObj = divisionObj?.districts.find((dist) => dist.name === formData.district);
          return districtObj?.upazilas.map((upa) => (typeof upa === "string" ? upa : upa.name || "")).filter(Boolean) || [];
        })()
      : [];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files ? files[0] : null }));
    } else if (name === "division") {
      setFormData((prev) => ({ ...prev, division: value, district: "", thana: "" }));
    } else if (name === "district") {
      setFormData((prev) => ({ ...prev, district: value, thana: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitText("Submitting...");

    try {
      // Upload image to Cloudinary
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
      const imageForm = new FormData();
      imageForm.append("file", formData.image as File);
      imageForm.append("upload_preset", uploadPreset);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: imageForm,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData?.error?.message || "Cloudinary upload failed");
      }

      const imageUrl = uploadData.secure_url;
      const location = `${formData.thana}, ${formData.district}, ${formData.division}`;

    const payload = {
    submitted_by: formData.submitted_by,
    phone: formData.phone,
    email: formData.email,
    title: formData.title,
    description: formData.description,
    property_type: formData.property_type,
    location,
    square_feet: formData.square_feet,
    purpose: formData.purpose,
    price_or_rent: formData.price_or_rent,
    imageUrl: imageUrl, 
    };


      const res = await fetch("/api/property-sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),


      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "Property submission failed");
      }

      setFormSubmitted(true);
      setSubmitText("Submitted ✔");
    } catch (err: any) {
      console.error(err);
      alert("Submission failed: " + err.message);
      setSubmitText("Submit");
    }
  };

  if (formSubmitted) {
    return (
      <div className="max-w-lg mx-auto p-6 mt-8 bg-green-100 text-green-800 rounded-md shadow-md">
        Your property selling form has been submitted successfully!
      </div>
    );
  }
  

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 border border-gray-300 rounded-md shadow-md mt-20 mb-20"
    >
      <h3 className="text-2xl font-semibold mb-6 text-center">Sell/Rent Out Your Property</h3>

      <input
        type="text"
        name="submitted_by"
        placeholder="Full Name"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={formData.submitted_by}
        onChange={handleInputChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number (e.g. +8801XXXXXXXXX)"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={formData.phone}
        onChange={handleInputChange}
        pattern="^\+8801[0-9]{9}$"
        title="Enter a valid Bangladeshi phone number starting with +8801"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={formData.email}
        onChange={handleInputChange}
        required
      />

      <input
        type="text"
        name="title"
        placeholder="Property Title"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={formData.title}
        onChange={handleInputChange}
        required
      />

      <textarea
        name="description"
        placeholder="Property Description"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        rows={4}
        value={formData.description}
        onChange={handleInputChange}
        required
      />

      <select
        name="property_type"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={formData.property_type}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Property Type</option>
        <option value="flat">Flat</option>
        <option value="house">House</option>
        <option value="commercial">Commercial Space</option>
        <option value="land">Land</option>
        <option value="other">Other</option>
      </select>

      <select
        name="division"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={formData.division}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Division</option>
        {divisions.map((div) => (
          <option key={div} value={div}>
            {div}
          </option>
        ))}
      </select>

      {formData.division && (
        <select
          name="district"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.district}
          onChange={handleInputChange}
          required
        >
          <option value="">Select District</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      )}

      {formData.district && (
        <select
          name="thana"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.thana}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Thana/Upazila</option>
          {thanas.map((thana) => (
            <option key={thana} value={thana}>
              {thana}
            </option>
          ))}
        </select>
      )}

      <input
        type="number"
        name="square_feet"
        placeholder="Area (sq ft)"
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        min={0}
        value={formData.square_feet}
        onChange={handleInputChange}
        required
      />

      <fieldset className="mb-4">
        <legend className="mb-2 font-medium">Listing Purpose</legend>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="purpose"
              value="sale"
              checked={formData.purpose === "sale"}
              onChange={handleInputChange}
              required
              className="accent-indigo-600"
            />
            <span>For Sale</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="purpose"
              value="rent"
              checked={formData.purpose === "rent"}
              onChange={handleInputChange}
              className="accent-indigo-600"
            />
            <span>For Rent</span>
          </label>
        </div>
      </fieldset>

      {formData.purpose && (
        <>
          <label className="block mb-2 font-medium">
            {formData.purpose === "sale" ? "Selling Price (BDT)" : "Monthly Rent (BDT)"}
          </label>
          <input
            type="number"
            name="price_or_rent"
            placeholder={formData.purpose === "sale" ? "Enter total price" : "Enter monthly rent"}
            className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={0}
            value={formData.price_or_rent}
            onChange={handleInputChange}
            required
          />
        </>
      )}

        <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Property Image</label>

        <div className="relative">
            <input
            id="imageUpload"
            type="file"
            name="image"
            accept="image/*"
            multiple={false}
            required
            className="hidden"
            onChange={handleInputChange}
            />
            <label
            htmlFor="imageUpload"
            className="cursor-pointer inline-block px-6 py-2 bg-gray-900 text-white font-medium rounded-md shadow hover:bg-gray-700 transition-colors duration-300"
            >
            Upload Image 
            </label>


            {formData.image && (
            <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{formData.image.name}</span>
            </p>
            )}
        </div>
        </div>



      <button
        type="submit"
        className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-md transition-colors duration-300"
      >
        {submitText}
      </button>
    </form>
  );
}
