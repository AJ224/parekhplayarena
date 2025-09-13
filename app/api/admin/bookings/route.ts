import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10
    const status = searchParams.get("status")

    console.log("Fetching admin bookings with limit:", limit, "status:", status)

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
