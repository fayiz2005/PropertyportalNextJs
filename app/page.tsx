'use client';

import Link from 'next/link';

import { ShoppingCartIcon, KeyIcon } from '@heroicons/react/24/solid'; 


export default function Home() {
  return (
    <>

      <main className="bg-white min-h-screen flex items-center justify-center px-4 mb-10 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl w-full">
          {/* Buy/Rent Button */}
          <Link
            href="/buy"
            className="group flex flex-col items-center justify-center bg-white border-2 border-gray-900 rounded-xl h-[400px] w-full shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:bg-gray-900 hover:text-white"
          >
            <ShoppingCartIcon className="h-28 w-28 text-gray-900 group-hover:text-white transition duration-300" />
            <p className="text-lg font-semibold mt-4 transition-colors duration-300">Buy/Rent a property</p>
          </Link>

          {/* Sell/Rent Out Button */}
          <Link
            href="/sell"
            className="group flex flex-col items-center justify-center bg-white border-2 border-gray-900 rounded-xl h-[400px] w-full shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:bg-gray-900 hover:text-white"
          >
            <KeyIcon className="h-28 w-28 text-gray-900 group-hover:text-white transition duration-300" />
            <p className="text-lg font-semibold mt-4 transition-colors duration-300">Sell/Rent Out a property</p>
          </Link>
        </div>
      </main>

    </>
  );
}
