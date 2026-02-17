"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  hasMore: boolean;
  currentOffset: number;
  pageSize: number;
}

export default function Pagination({ hasMore, currentOffset, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.floor(currentOffset / pageSize) + 1;

  const navigate = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newOffset > 0) {
      params.set("offset", String(newOffset));
    } else {
      params.delete("offset");
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        onClick={() => navigate(Math.max(0, currentOffset - pageSize))}
        disabled={currentOffset === 0}
        className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="text-sm text-gray-600">Page {page}</span>

      <button
        onClick={() => navigate(currentOffset + pageSize)}
        disabled={!hasMore}
        className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
