import { type NextRequest, NextResponse } from "next/server"
import { getVenues } from "@/lib/database/venues"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      city: searchParams.get("city") || undefined,
      sport: searchParams.get("sport") || undefined,
      location: searchParams.get("location") || undefined,
      priceRange: searchParams.get("priceRange") ? JSON.parse(searchParams.get("priceRange")!) : undefined,
      amenities: searchParams.get("amenities") ? JSON.parse(searchParams.get("amenities")!) : undefined,
    }

    console.log("Fetching venues with filters:", filters)
    const venues = await getVenues(filters)

    return NextResponse.json({
      success: true,
      venues,
      count: venues.length,
    })
  } catch (error) {
    console.error("Error fetching venues:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch venues",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
