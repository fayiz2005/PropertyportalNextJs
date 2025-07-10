"use client";

import { useState } from "react";
import Link from "next/link";

const SidebarNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden m-3 px-4 py-2 bg-gray-800 text-white rounded"
      >
        ☰ Menu
      </button>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-52 bg-white shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-bold">PROPERTY PORTAL</h5>
          <button onClick={() => setIsOpen(false)} className="text-xl font-bold">
            ×
          </button>
        </div>

        <ul className="flex flex-col p-4 space-y-2">
          <li>
            <Link href="/" className="block px-4 py-2 bg-gray-800 text-white rounded">
              Home
            </Link>
          </li>
          <li>
            <Link href="/buy" className="block px-4 py-2 bg-gray-800 text-white rounded">
              Buy/Rent
            </Link>
          </li>
          <li>
            <Link href="/sell" className="block px-4 py-2 bg-gray-800 text-white rounded">
              Sell/Rent Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Desktop navbar */}
      <div className="hidden lg:flex justify-around items-center px-4 py-2 bg-white shadow w-full">
        <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded">Home</Link>
        <Link href="/buy" className="px-4 py-2 bg-gray-800 text-white rounded">Buy/Rent</Link>
        <Link href="/sell" className="px-4 py-2 bg-gray-800 text-white rounded">Sell/Rent Out</Link>
      </div>
    </>
  );
};

export default SidebarNavbar;
