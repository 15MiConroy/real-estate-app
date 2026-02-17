import { getListing } from "@/lib/db";
import { formatPrice, formatAddress } from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";
import MortgageCalculator from "@/components/MortgageCalculator";
import FavoriteButton from "@/components/FavoriteButton";
import MapView from "@/components/MapView";
import {
  Bed, Bath, Square, Calendar,
  MapPin, User, Building2, Phone, Mail, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const mlsId = parseInt(params.id);
  if (isNaN(mlsId)) notFound();

  const property = await getListing(mlsId);
  if (!property) notFound();

  const { address, listPrice, property: details, photos, agents, office, mls, remarks, geo, tax } = property;
  const fullAddress = formatAddress(address);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back link */}
      <Link
        href="/search"
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <ImageCarousel images={photos} alt={fullAddress} />

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{formatPrice(listPrice)}</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {fullAddress}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                mls.status === "Active" ? "bg-green-500" :
                mls.status === "Pending" ? "bg-yellow-500" :
                "bg-gray-500"
              }`}>
                {mls.status} {mls.daysOnMarket > 0 && `· ${mls.daysOnMarket} days on market`}
              </span>
            </div>
            <FavoriteButton mlsId={mlsId} size="lg" />
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Bed, label: "Bedrooms", value: details.bedrooms },
              { icon: Bath, label: "Bathrooms", value: `${details.bathsFull} full${details.bathsHalf ? `, ${details.bathsHalf} half` : ""}` },
              { icon: Square, label: "Sq Ft", value: details.area?.toLocaleString() || "N/A" },
              { icon: Calendar, label: "Year Built", value: details.yearBuilt || "N/A" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {remarks && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{remarks}</p>
            </div>
          )}

          {/* Property Details */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Property Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                { label: "Property Type", value: details.type },
                { label: "Style", value: details.style },
                { label: "Stories", value: details.stories },
                { label: "Lot Size", value: details.lotSize },
                { label: "Garage Spaces", value: details.garageSpaces },
                { label: "Parking", value: details.parking?.description },
                { label: "Heating", value: details.heating },
                { label: "Cooling", value: details.cooling },
                { label: "Flooring", value: details.flooring },
                { label: "Roof", value: details.roof },
                { label: "Construction", value: details.construction },
                { label: "Foundation", value: details.foundation },
                { label: "Pool", value: details.pool },
                { label: "Fireplaces", value: details.fireplaces || undefined },
                { label: "View", value: details.view },
                { label: "Subdivision", value: details.subdivision },
              ]
                .filter((item) => item.value)
                .map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="text-sm font-medium capitalize">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Interior Features */}
          {details.interiorFeatures && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Interior Features</h2>
              <p className="text-gray-600 text-sm">{details.interiorFeatures}</p>
            </div>
          )}

          {/* Exterior Features */}
          {details.exteriorFeatures && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Exterior Features</h2>
              <p className="text-gray-600 text-sm">{details.exteriorFeatures}</p>
            </div>
          )}

          {/* Map */}
          {geo?.lat && geo?.lng && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200">
                <MapView properties={[property]} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mortgage Calculator */}
          <MortgageCalculator homePrice={listPrice} />

          {/* Agent Info */}
          {agents?.[0] && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                Listing Agent
              </h3>
              <p className="font-medium">
                {agents[0].firstName} {agents[0].lastName}
              </p>
              {agents[0].contact?.office && (
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4" />
                  {agents[0].contact.office}
                </p>
              )}
              {agents[0].contact?.email && (
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {agents[0].contact.email}
                </p>
              )}
            </div>
          )}

          {/* Office Info */}
          {office && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                Listing Office
              </h3>
              <p className="font-medium">{office.name}</p>
              {office.contact?.office && (
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4" />
                  {office.contact.office}
                </p>
              )}
            </div>
          )}

          {/* Tax Info */}
          {tax?.taxAnnualAmount > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Tax Information</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Annual Tax</span>
                <span className="font-medium">{formatPrice(tax.taxAnnualAmount)}</span>
              </div>
              {tax.taxYear && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Tax Year</span>
                  <span className="font-medium">{tax.taxYear}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
