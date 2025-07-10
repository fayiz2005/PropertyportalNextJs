"use client";

import { useEffect, useState } from "react";

const images = [
  "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg",
  "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
];

const PropertyBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden max-h-[350px] h-[350px]">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          className={`absolute w-full h-full object-cover top-0 left-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Controls */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded z-20"
        onClick={() =>
          setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
        }
      >
        ‹
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded z-20"
        onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
      >
        ›
      </button>
    </div>
  );
};

export default PropertyBanner;
