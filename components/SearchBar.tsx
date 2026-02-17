"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
}

export default function SearchBar({ initialQuery = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div
        className={`flex items-center bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${
          large ? "px-6 py-4" : "px-4 py-2.5"
        }`}
      >
        <Search className={`text-gray-400 flex-shrink-0 ${large ? "w-6 h-6" : "w-5 h-5"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city, address, or neighborhood..."
          className={`flex-1 outline-none bg-transparent ml-3 text-gray-700 placeholder:text-gray-400 ${
            large ? "text-lg" : "text-base"
          }`}
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors ${
            large ? "px-8 py-2.5 text-base" : "px-5 py-2 text-sm"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
