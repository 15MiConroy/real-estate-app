"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/api";
import Link from "next/link";
import { useMemo } from "react";

// Fix default marker icon issue with webpack
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapViewClientProps {
  properties: Property[];
}

export default function MapViewClient({ properties }: MapViewClientProps) {
  const validProperties = properties.filter(
    (p) => p.geo?.lat && p.geo?.lng
  );

  const center = useMemo(() => {
    if (validProperties.length === 0) return [29.7604, -95.3698] as [number, number]; // Houston default
    const avgLat = validProperties.reduce((sum, p) => sum + p.geo.lat, 0) / validProperties.length;
    const avgLng = validProperties.reduce((sum, p) => sum + p.geo.lng, 0) / validProperties.length;
    return [avgLat, avgLng] as [number, number];
  }, [validProperties]);

  return (
    <MapContainer
      center={center}
      zoom={11}
      className="w-full h-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validProperties.map((property) => (
        <Marker
          key={property.mlsId}
          position={[property.geo.lat, property.geo.lng]}
        >
          <Popup>
            <div className="p-2 min-w-[180px]">
              <p className="font-bold text-blue-600">{formatPrice(property.listPrice)}</p>
              <p className="text-xs text-gray-600 mt-1">{property.address.full}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {property.property.bedrooms} bd | {property.property.bathsFull} ba | {property.property.area.toLocaleString()} sqft
              </p>
              <Link
                href={`/property/${property.mlsId}`}
                className="text-xs text-blue-500 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
