"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (mlsId: number) => void;
  isFavorite: (mlsId: number) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  // Load favorites from localStorage or Supabase depending on auth state
  useEffect(() => {
    if (user) {
      // Logged in: load from Supabase
      const loadAndMigrate = async () => {
        // Fetch existing Supabase favorites
        const { data } = await supabase
          .from("favorites")
          .select("mls_id")
          .eq("user_id", user.id);

        const dbFavorites = (data ?? []).map((row) => row.mls_id as number);

        // Check for localStorage favorites to migrate
        const stored = localStorage.getItem("favorites");
        let localFavorites: number[] = [];
        if (stored) {
          try {
            localFavorites = JSON.parse(stored);
          } catch {}
        }

        // Merge local favorites into Supabase
        const toMigrate = localFavorites.filter((id) => !dbFavorites.includes(id));
        if (toMigrate.length > 0) {
          const rows = toMigrate.map((mls_id) => ({ user_id: user.id, mls_id }));
          await supabase.from("favorites").upsert(rows, { onConflict: "user_id,mls_id" });
          localStorage.removeItem("favorites");
          setFavorites([...dbFavorites, ...toMigrate]);
        } else {
          if (localFavorites.length > 0) localStorage.removeItem("favorites");
          setFavorites(dbFavorites);
        }

        setLoaded(true);
      };
      loadAndMigrate();
    } else {
      // Logged out: load from localStorage
      const stored = localStorage.getItem("favorites");
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {}
      }
      setLoaded(true);
    }
  }, [user, supabase]);

  // Persist to localStorage when logged out
  useEffect(() => {
    if (loaded && !user) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, loaded, user]);

  // Debounce tracking: prevent rapid toggling of the same listing
  const pendingToggles = useRef<Set<number>>(new Set());

  const toggleFavorite = useCallback(
    (mlsId: number) => {
      if (pendingToggles.current.has(mlsId)) return;

      setFavorites((prev) => {
        const isFav = prev.includes(mlsId);
        const next = isFav ? prev.filter((id) => id !== mlsId) : [...prev, mlsId];

        if (user) {
          pendingToggles.current.add(mlsId);

          // Sync with Supabase in background
          const operation = isFav
            ? supabase
                .from("favorites")
                .delete()
                .eq("user_id", user.id)
                .eq("mls_id", mlsId)
            : supabase
                .from("favorites")
                .insert({ user_id: user.id, mls_id: mlsId });

          operation.then(({ error }) => {
            pendingToggles.current.delete(mlsId);
            if (error) {
              console.error("Failed to update favorite:", error.message);
              // Revert optimistic update
              setFavorites(prev);
            }
          });
        }

        return next;
      });
    },
    [user, supabase]
  );

  const isFavorite = useCallback(
    (mlsId: number) => favorites.includes(mlsId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, count: favorites.length }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
