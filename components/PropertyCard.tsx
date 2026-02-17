"use client";

import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/api";
import FavoriteButton from "./FavoriteButton";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { address, listPrice, property: details, photos, mls, mlsId } = property;
  const photo = photos?.[0] || "";

  return (
    <Link href={`/property/${mlsId}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {photo ? (
            <Image
              src={photo}
              alt={address.full}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No photo available
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              mls.status === "Active" ? "bg-green-500" :
              mls.status === "Pending" ? "bg-yellow-500" :
              "bg-gray-500"
            }`}>
              {mls.status}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <FavoriteButton mlsId={mlsId} size="sm" />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-2xl font-bold text-gray-900">{formatPrice(listPrice)}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            {details.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {details.bedrooms} bd
              </span>
            )}
            {details.bathsFull > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {details.bathsFull} ba
              </span>
            )}
            {details.area > 0 && (
              <span className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                {details.area.toLocaleString()} sqft
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {address.full}, {address.city}, {address.state}
          </p>
          {details.type && (
            <p className="mt-1 text-xs text-gray-400 capitalize">{details.type}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
