"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="w-20 h-8 skeleton rounded" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 hidden sm:flex items-center gap-1">
        <User className="w-4 h-4" />
        {user.email}
      </span>
      <button
        onClick={() => signOut()}
        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
