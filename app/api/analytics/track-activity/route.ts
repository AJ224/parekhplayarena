import { type NextRequest, NextResponse } from "next/server"
import { trackUserActivity } from "@/lib/database/bookings"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.user_id || !body.activity_type) {
      return NextResponse.json(
        { error: "Missing required fields: user_id and activity_type" },
        { status: 400 }
      )
    }

    const activity = await trackUserActivity(body)

    return NextResponse.json({
      success: true,
      activity,
    })
  } catch (error) {
    console.error("Error tracking user activity:", error)
    return NextResponse.json(
      {
        error: "Failed to track user activity",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
