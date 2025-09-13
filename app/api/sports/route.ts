import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const featured = searchParams.get("featured") === "true"

    console.log("Fetching sports with limit:", limit, "featured:", featured)

    const supabase = createServerClient()
    
    let query = supabase
      .from("sports")
      .select(`
        id,
        name,
        description,
        icon_url,
        venues:venues(count)
      `)
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data: sports, error } = await query

    if (error) {
      console.error("Error fetching sports:", error)
      throw new Error("Failed to fetch sports")
    }

    // Transform data to include venue count
    const sportsWithCounts = sports?.map(sport => ({
      id: sport.id,
      name: sport.name,
      description: sport.description,
      icon_url: sport.icon_url,
      venues: sport.venues?.[0]?.count || 0
    })) || []

    return NextResponse.json({
      success: true,
      sports: sportsWithCounts,
      count: sportsWithCounts.length,
    })
  } catch (error) {
    console.error("Error fetching sports:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch sports",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
