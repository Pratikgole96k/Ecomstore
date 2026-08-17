'use client';

import React, { useState } from 'react';
import { ProductImageItem } from '@/types';

export default function ImageGallery({
  images,
  productName,
}: {
  images: ProductImageItem[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  const activeImage =
    images[selectedIndex]?.imageUrl ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 shrink-0">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                selectedIndex === idx
                  ? 'border-vastrika-maroon-800 shadow-md scale-105'
                  : 'border-vastrika-ivory-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.imageUrl}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase Image with Zoom Preview */}
      <div
        className="relative flex-1 aspect-[3/4] bg-vastrika-ivory-100 rounded-2xl overflow-hidden border border-vastrika-ivory-300 cursor-crosshair group shadow-luxury"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={activeImage}
          alt={productName}
          className="w-full h-full object-cover object-top"
          priority-img="true"
        />

        {/* Magnifying Zoom Lens Layer */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block rounded-2xl transition-opacity duration-200"
          style={{
            ...zoomStyle,
            backgroundImage: `url(${activeImage})`,
            backgroundSize: '220%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full pointer-events-none hidden md:block">
          Hover to Zoom
        </div>
      </div>
    </div>
  );
}
