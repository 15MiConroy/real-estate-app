import { createClient } from "@supabase/supabase-js";
import { searchProperties } from "@/lib/api";
import { Property } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

function toRow(p: Property) {
  return {
    mls_id: p.mlsId,
    listing_id: p.listingId,
    status: p.mls?.status ?? "Active",
    list_price: p.listPrice,
    address_full: p.address?.full ?? "",
    city: p.address?.city ?? "",
    state: p.address?.state ?? "",
    postal_code: p.address?.postalCode ?? "",
    bedrooms: p.property?.bedrooms ?? 0,
    baths_full: p.property?.bathsFull ?? 0,
    baths_half: p.property?.bathsHalf ?? 0,
    sqft: p.property?.area ?? null,
    year_built: p.property?.yearBuilt ?? null,
    property_type: p.property?.type ?? null,
    lat: p.geo?.lat ?? null,
    lng: p.geo?.lng ?? null,
    photo_url: p.photos?.[0] ?? null,
    list_date: p.listDate ?? null,
    raw_json: p,
    synced_at: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.SYNC_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Fetch all properties from SimplyRETS (demo API returns ~100)
    const properties = await searchProperties({ limit: 250 });

    const rows = properties.map(toRow);

    const { error } = await supabase
      .from("listings")
      .upsert(rows, { onConflict: "mls_id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ synced: rows.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
