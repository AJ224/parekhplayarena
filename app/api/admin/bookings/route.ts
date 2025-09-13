import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50
    const status = searchParams.get("status")
    const venue = searchParams.get("venue")
    const sport = searchParams.get("sport")
    const search = searchParams.get("search")

    console.log("Fetching admin bookings with filters:", { limit, status, venue, sport, search })

    const supabase = createServerClient()
    
    let query = supabase
      .from("bookings")
      .select(`
        *,
        venues (name, address),
        courts (name, type),
        users (full_name, email, phone)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    if (venue) {
      query = query.eq("venue_id", venue)
    }

    if (sport) {
      query = query.eq("sport_id", sport)
    }

    if (search) {
      query = query.or(`booking_reference.ilike.%${search}%,users.full_name.ilike.%${search}%,users.email.ilike.%${search}%`)
    }

    const { data: bookings, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
    })
  } catch (error) {
    console.error("Error fetching admin bookings:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin bookings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
