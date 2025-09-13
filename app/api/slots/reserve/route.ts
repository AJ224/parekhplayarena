import { type NextRequest, NextResponse } from "next/server"
import { reserveSlot } from "@/lib/database/bookings"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["court_id", "date", "start_time", "end_time", "user_id"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const reservationId = await reserveSlot(body)

    return NextResponse.json({
      success: true,
      reservation_id: reservationId,
      message: "Slot reserved successfully",
    })
  } catch (error) {
    console.error("Error reserving slot:", error)
    return NextResponse.json(
      {
        error: "Failed to reserve slot",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
