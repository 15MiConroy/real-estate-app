import { Property, SearchParams } from "./types";

const BASE_URL = "https://api.simplyrets.com";
const AUTH = Buffer.from("simplyrets:simplyrets").toString("base64");

async function fetchAPI<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${AUTH}`,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function searchProperties(params: SearchParams = {}): Promise<Property[]> {
  const queryParams: Record<string, string | number | undefined> = {};

  if (params.q) queryParams.q = params.q;
  if (params.status) queryParams.status = params.status;
  if (params.type) queryParams.type = params.type;
  if (params.minprice) queryParams.minprice = params.minprice;
  if (params.maxprice) queryParams.maxprice = params.maxprice;
  if (params.minbeds) queryParams.minbeds = params.minbeds;
  if (params.maxbeds) queryParams.maxbeds = params.maxbeds;
  if (params.minbaths) queryParams.minbaths = params.minbaths;
  if (params.maxbaths) queryParams.maxbaths = params.maxbaths;
  if (params.limit) queryParams.limit = params.limit;
  if (params.lastId) queryParams.lastId = params.lastId;
  if (params.offset) queryParams.offset = params.offset;

  return fetchAPI<Property[]>("/properties", queryParams);
}

export async function getProperty(mlsId: number): Promise<Property> {
  return fetchAPI<Property>(`/properties/${mlsId}`);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatAddress(address: Property["address"]): string {
  return `${address.full}, ${address.city}, ${address.state} ${address.postalCode}`;
}
