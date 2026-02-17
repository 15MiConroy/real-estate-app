import { getProperty } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { mlsId: string } }
) {
  const mlsId = parseInt(params.mlsId);
  if (isNaN(mlsId) || mlsId <= 0) {
    return NextResponse.json({ error: "Invalid MLS ID" }, { status: 400 });
  }

  try {
    const property = await getProperty(mlsId);
    return NextResponse.json(property);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
