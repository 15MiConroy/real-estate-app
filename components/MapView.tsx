"use client";

import { useEffect, useState } from "react";
import { Property } from "@/lib/types";

interface MapViewProps {
  properties: Property[];
}

export default function MapView({ properties }: MapViewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapViewProps> | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    import("./MapViewClient").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  return <MapComponent properties={properties} />;
}
