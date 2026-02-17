import { Property } from "@/lib/types";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No properties found</p>
        <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.mlsId} property={property} />
      ))}
    </div>
  );
}
