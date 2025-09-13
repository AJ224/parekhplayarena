import { type NextRequest, NextResponse } from "next/server"
import { calculateSlotPrice } from "@/lib/database/bookings"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const venueId = searchParams.get("venue_id")
    const courtId = searchParams.get("court_id")
    const date = searchParams.get("date")
    const startTime = searchParams.get("start_time")
    const endTime = searchParams.get("end_time")
    
    if (!venueId || !courtId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required parameters: venue_id, court_id, date, start_time, end_time" },
        { status: 400 }
      )
    }

    const price = await calculateSlotPrice({
      venue_id: venueId,
      court_id: courtId,
      date,
      start_time: startTime,
      end_time: endTime,
    })

    return NextResponse.json({
      success: true,
      price,
      price_in_rupees: Math.floor(price / 100),
      venue_id: venueId,
      court_id: courtId,
      date,
      start_time: startTime,
      end_time: endTime,
    })
  } catch (error) {
    console.error("Error calculating slot price:", error)
    return NextResponse.json(
      {
        error: "Failed to calculate slot price",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
