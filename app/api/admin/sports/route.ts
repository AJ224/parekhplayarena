import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching admin sports...")

    const supabase = createServerClient()
    
    const { data: sports, error } = await supabase
      .from("sports")
      .select(`
        *,
        venues!inner(count)
      `)
      .order("name", { ascending: true })

    if (error) {
      throw error
    }

    // Transform the data to include venue count
    const sportsWithCount = sports?.map(sport => ({
      ...sport,
      venues: sport.venues?.length || 0
    })) || []

    return NextResponse.json({
      success: true,
      sports: sportsWithCount,
    })
  } catch (error) {
    console.error("Error fetching admin sports:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin sports",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
