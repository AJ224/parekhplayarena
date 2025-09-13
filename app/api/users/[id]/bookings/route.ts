import { type NextRequest, NextResponse } from "next/server"
import { getUserBookings } from "@/lib/database/bookings"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const status = searchParams.get("status") || undefined

    console.log("Fetching bookings for user ID:", userId, "with limit:", limit, "status:", status)

    const bookings = await getUserBookings(userId, status)

    // Apply limit if specified
    const limitedBookings = limit ? bookings.slice(0, limit) : bookings

    return NextResponse.json({
      success: true,
      bookings: limitedBookings,
      total: bookings.length,
    })
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user bookings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
