import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    console.log("Fetching cities with state:", state, "limit:", limit)

    const supabase = createServerClient()
    
    let query = supabase
      .from("cities")
      .select(`
        id,
        name,
        state,
        country,
        locations:locations(count)
      `)
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (state) {
      query = query.eq("state", state)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data: cities, error } = await query

    if (error) {
      console.error("Error fetching cities:", error)
      throw new Error("Failed to fetch cities")
    }

    // Transform data to include location count
    const citiesWithCounts = cities?.map(city => ({
      id: city.id,
      name: city.name,
      state: city.state,
      country: city.country,
      locations: city.locations?.[0]?.count || 0
    })) || []

    return NextResponse.json({
      success: true,
      cities: citiesWithCounts,
      count: citiesWithCounts.length,
    })
  } catch (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
