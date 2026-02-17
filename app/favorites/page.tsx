"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { Property } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("listings")
          .select("raw_json")
          .in("mls_id", favorites);

        if (error) throw error;

        setProperties((data ?? []).map((row) => row.raw_json as Property));
      } catch {
        // Fallback to direct API if DB has no data yet
        const results = await Promise.all(
          favorites.map(async (mlsId) => {
            const res = await fetch(
              `https://api.simplyrets.com/properties/${mlsId}`,
              {
                headers: {
                  Authorization: `Basic ${btoa("simplyrets:simplyrets")}`,
                },
              }
            );
            if (!res.ok) return null;
            return res.json();
          })
        );
        setProperties(results.filter(Boolean));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-7 h-7 text-red-500 fill-red-500" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Saved Properties</h1>
          <p className="text-gray-500 text-sm mt-1">
            {favorites.length} {favorites.length === 1 ? "property" : "properties"} saved
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: favorites.length || 3 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="aspect-[4/3] skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-32 skeleton rounded" />
                <div className="h-4 w-48 skeleton rounded" />
                <div className="h-4 w-full skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No saved properties yet</h2>
          <p className="text-gray-400 mt-2">
            Browse listings and click the heart icon to save your favorites
          </p>
          <Link
            href="/search"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.mlsId} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
