import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching admin locations...")

    const supabase = createServerClient()
    
    const { data: locations, error } = await supabase
      .from("locations")
      .select(`
        *,
        cities (name),
        venues!inner(count)
      `)
      .order("name", { ascending: true })

    if (error) {
      throw error
    }

    // Transform the data to include venue count
    const locationsWithCount = locations?.map(location => ({
      ...location,
      venues: location.venues?.length || 0
    })) || []

    return NextResponse.json({
      success: true,
      locations: locationsWithCount,
    })
  } catch (error) {
    console.error("Error fetching admin locations:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin locations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
