import { createClient } from "@/lib/supabase/server";
import { Property, SearchParams } from "./types";

const MAX_LIMIT = 100;

export async function searchListings(params: SearchParams = {}): Promise<Property[]> {
  const supabase = createClient();

  const limit = Math.min(params.limit || 12, MAX_LIMIT);

  let query = supabase.from("listings").select("raw_json");

  if (params.status) {
    query = query.eq("status", params.status);
  }
  if (params.type) {
    query = query.eq("property_type", params.type);
  }
  if (params.minprice) {
    query = query.gte("list_price", params.minprice);
  }
  if (params.maxprice) {
    query = query.lte("list_price", params.maxprice);
  }
  if (params.minbeds) {
    query = query.gte("bedrooms", params.minbeds);
  }
  if (params.maxbeds) {
    query = query.lte("bedrooms", params.maxbeds);
  }
  if (params.minbaths) {
    query = query.gte("baths_full", params.minbaths);
  }
  if (params.maxbaths) {
    query = query.lte("baths_full", params.maxbaths);
  }
  if (params.q) {
    const sanitized = params.q.replace(/[%_]/g, "\\$&");
    query = query.ilike("address_full", `%${sanitized}%`);
  }

  query = query.order("list_price", { ascending: false });

  query = query.limit(limit);
  if (params.offset) {
    query = query.range(params.offset, params.offset + limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`DB error: ${error.message}`);
  }

  return (data ?? []).map((row) => row.raw_json as Property);
}

export async function getListing(mlsId: number): Promise<Property | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("raw_json")
    .eq("mls_id", mlsId)
    .single();

  if (error) {
    return null;
  }

  return data.raw_json as Property;
}

export async function getListingsByIds(mlsIds: number[]): Promise<Property[]> {
  if (mlsIds.length === 0) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("raw_json")
    .in("mls_id", mlsIds);

  if (error) {
    throw new Error(`DB error: ${error.message}`);
  }

  return (data ?? []).map((row) => row.raw_json as Property);
}
