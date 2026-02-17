"use client";

import Link from "next/link";
import { Home, Search, Heart, Menu, X } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useState } from "react";
import AuthButton from "./AuthButton";

export default function Navbar() {
  const { count } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Home className="w-6 h-6" />
            <span>HomeQuest</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 relative"
            >
              <Heart className="w-4 h-4" />
              Favorites
              {count > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 pt-3">
              <Link
                href="/"
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/search"
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
              <Link
                href="/favorites"
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Favorites {count > 0 && `(${count})`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
