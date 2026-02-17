"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

interface FavoriteButtonProps {
  mlsId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FavoriteButton({ mlsId, size = "md", className = "" }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const active = isFavorite(mlsId);

  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const paddingMap = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(mlsId);
      }}
      className={`${paddingMap[size]} rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110 ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeMap[size]} transition-colors ${
          active ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
    </button>
  );
}
