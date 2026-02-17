import { searchListings } from "@/lib/db";
import { SearchParams } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import SearchFilters from "@/components/SearchFilters";
import PropertyGrid from "@/components/PropertyGrid";
import MapView from "@/components/MapView";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function clampInt(value: string | undefined, min: number, max: number): number | undefined {
  if (typeof value !== "string") return undefined;
  const n = parseInt(value);
  if (isNaN(n)) return undefined;
  return Math.max(min, Math.min(max, n));
}

const VALID_STATUSES = ["Active", "Pending", "Closed"];
const VALID_TYPES = ["Residential", "Condominium", "Townhouse", "Land", "Commercial"];

export default async function SearchPage({ searchParams }: PageProps) {
  const params: SearchParams = {
    limit: PAGE_SIZE,
  };

  const q = typeof searchParams.q === "string" ? searchParams.q.slice(0, 200) : undefined;
  const offset = clampInt(searchParams.offset as string, 0, 10000) ?? 0;

  if (q) params.q = q;
  if (typeof searchParams.status === "string" && VALID_STATUSES.includes(searchParams.status)) {
    params.status = searchParams.status;
  }
  if (typeof searchParams.type === "string" && VALID_TYPES.includes(searchParams.type)) {
    params.type = searchParams.type;
  }
  params.minprice = clampInt(searchParams.minprice as string, 0, 100_000_000);
  params.maxprice = clampInt(searchParams.maxprice as string, 0, 100_000_000);
  params.minbeds = clampInt(searchParams.minbeds as string, 0, 20);
  params.maxbeds = clampInt(searchParams.maxbeds as string, 0, 20);
  params.minbaths = clampInt(searchParams.minbaths as string, 0, 20);
  params.maxbaths = clampInt(searchParams.maxbaths as string, 0, 20);
  if (offset > 0) params.offset = offset;

  let properties: Awaited<ReturnType<typeof searchListings>> = [];
  let error = false;
  try {
    properties = await searchListings(params);
  } catch {
    properties = [];
    error = true;
  }

  const hasMore = properties.length === PAGE_SIZE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <SearchBar initialQuery={q} />
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <div className="mb-6">
          <SearchFilters />
        </div>
      </Suspense>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
          Failed to load listings. Please try again later.
        </div>
      )}

      {/* Map + Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 h-[300px] lg:h-[calc(100vh-220px)] lg:sticky lg:top-20 rounded-xl overflow-hidden border border-gray-200">
          <MapView properties={properties} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {properties.length > 0
                ? `Showing ${offset + 1}-${offset + properties.length} results`
                : "No results found"}
            </p>
          </div>

          <PropertyGrid properties={properties} />

          {properties.length > 0 && (
            <Suspense fallback={null}>
              <Pagination
                hasMore={hasMore}
                currentOffset={offset}
                pageSize={PAGE_SIZE}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
