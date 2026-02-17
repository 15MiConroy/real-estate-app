"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset pagination when filters change
      params.delete("lastId");
      params.delete("offset");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectClass =
    "px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SlidersHorizontal className="w-4 h-4 text-gray-500 hidden sm:block" />

      <select
        value={searchParams.get("status") || ""}
        onChange={(e) => updateFilter("status", e.target.value)}
        className={selectClass}
      >
        <option value="">Any Status</option>
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed</option>
      </select>

      <select
        value={searchParams.get("type") || ""}
        onChange={(e) => updateFilter("type", e.target.value)}
        className={selectClass}
      >
        <option value="">Any Type</option>
        <option value="residential">Residential</option>
        <option value="condominium">Condominium</option>
        <option value="rental">Rental</option>
        <option value="multifamily">Multi-Family</option>
        <option value="land">Land</option>
        <option value="commercial">Commercial</option>
      </select>

      <select
        value={searchParams.get("minprice") || ""}
        onChange={(e) => updateFilter("minprice", e.target.value)}
        className={selectClass}
      >
        <option value="">Min Price</option>
        <option value="50000">$50K</option>
        <option value="100000">$100K</option>
        <option value="200000">$200K</option>
        <option value="300000">$300K</option>
        <option value="500000">$500K</option>
        <option value="750000">$750K</option>
        <option value="1000000">$1M</option>
      </select>

      <select
        value={searchParams.get("maxprice") || ""}
        onChange={(e) => updateFilter("maxprice", e.target.value)}
        className={selectClass}
      >
        <option value="">Max Price</option>
        <option value="100000">$100K</option>
        <option value="200000">$200K</option>
        <option value="300000">$300K</option>
        <option value="500000">$500K</option>
        <option value="750000">$750K</option>
        <option value="1000000">$1M</option>
        <option value="2000000">$2M</option>
        <option value="5000000">$5M+</option>
      </select>

      <select
        value={searchParams.get("minbeds") || ""}
        onChange={(e) => updateFilter("minbeds", e.target.value)}
        className={selectClass}
      >
        <option value="">Beds</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
      </select>

      <select
        value={searchParams.get("minbaths") || ""}
        onChange={(e) => updateFilter("minbaths", e.target.value)}
        className={selectClass}
      >
        <option value="">Baths</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
    </div>
  );
}
