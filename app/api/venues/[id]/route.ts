import { type NextRequest, NextResponse } from "next/server"
import { getVenueById } from "@/lib/database/venues"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const venueId = params.id
    console.log("Fetching venue with ID:", venueId)

    const venue = await getVenueById(venueId)

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      venue,
    })
  } catch (error) {
    console.error("Error fetching venue:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch venue",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
