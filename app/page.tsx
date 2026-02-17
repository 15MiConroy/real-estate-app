import { searchListings } from "@/lib/db";
import SearchBar from "@/components/SearchBar";
import PropertyGrid from "@/components/PropertyGrid";
import { Home, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  let featuredListings: Awaited<ReturnType<typeof searchListings>> = [];
  try {
    featuredListings = await searchListings({ limit: 6, status: "Active" });
  } catch {
    featuredListings = [];
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMTItNGgyMHYtMkgyNHYyem0yMC0xMkgyNHYyaDIwdi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect
              <span className="block text-blue-200">Home with AgentNest</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Your AI-powered real estate agent. Browse thousands of listings, explore neighborhoods, and find your dream home.
            </p>
            <div className="mt-10 flex justify-center">
              <SearchBar large />
            </div>

            {/* Quick filter chips */}
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/search?status=Active"
                className="px-5 py-2 bg-white/15 hover:bg-white/25 rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Buy
              </Link>
              <Link
                href="/search?type=rental"
                className="px-5 py-2 bg-white/15 hover:bg-white/25 rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Rent
              </Link>
              <Link
                href="/search?status=Closed"
                className="px-5 py-2 bg-white/15 hover:bg-white/25 rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Sold
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Thousands of Listings</h3>
              <p className="text-gray-500 mt-2">Browse an extensive database of properties with detailed info, photos, and virtual tours.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Smart Insights</h3>
              <p className="text-gray-500 mt-2">Get mortgage estimates, market data, and neighborhood details to make informed decisions.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Trusted Data</h3>
              <p className="text-gray-500 mt-2">All listings sourced from MLS with verified agent information and up-to-date pricing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Featured Listings</h2>
                <p className="text-gray-500 mt-1">Explore some of our top properties</p>
              </div>
              <Link
                href="/search"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </Link>
            </div>
            <PropertyGrid properties={featuredListings} />
          </div>
        </section>
      )}
    </div>
  );
}
