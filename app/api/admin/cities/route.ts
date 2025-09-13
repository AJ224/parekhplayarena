import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching admin cities...")

    const supabase = createServerClient()
    
    const { data: cities, error } = await supabase
      .from("cities")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      throw error
    }

    // For now, just return cities without venue count to avoid complex queries
    // TODO: Implement venue count calculation if needed
    const citiesWithCount = cities?.map(city => ({
      ...city,
      venues: 0 // Placeholder - can be calculated separately if needed
    })) || []

    return NextResponse.json({
      success: true,
      cities: citiesWithCount,
    })
  } catch (error) {
    console.error("Error fetching admin cities:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin cities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
