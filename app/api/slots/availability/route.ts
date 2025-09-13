import { type NextRequest, NextResponse } from "next/server"
import { getSlotAvailability } from "@/lib/database/bookings"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const courtId = searchParams.get("court_id")
    const date = searchParams.get("date")
    
    if (!courtId || !date) {
      return NextResponse.json(
        { error: "Missing required parameters: court_id and date" },
        { status: 400 }
      )
    }

    const availability = await getSlotAvailability(courtId, date)

    return NextResponse.json({
      success: true,
      availability,
      court_id: courtId,
      date,
    })
  } catch (error) {
    console.error("Error fetching slot availability:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch slot availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
