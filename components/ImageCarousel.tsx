"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center rounded-xl">
        <p className="text-gray-400">No photos available</p>
      </div>
    );
  }

  const goTo = (index: number) => {
    setCurrent((index + images.length) % images.length);
  };

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 group">
      <Image
        src={images[current]}
        alt={`${alt} - Photo ${current + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 66vw"
        priority={current === 0}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 10).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-4" : "bg-white/60"
                }`}
              />
            ))}
            {images.length > 10 && (
              <span className="text-white text-xs ml-1">+{images.length - 10}</span>
            )}
          </div>

          {/* Counter */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
