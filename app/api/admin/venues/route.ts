import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching admin venues...")

    const supabase = createServerClient()
    
    const { data: venues, error } = await supabase
      .from("venues")
      .select(`
        *,
        locations!inner(name, pincode, cities(name, state, country))
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      venues: venues || [],
    })
  } catch (error) {
    console.error("Error fetching admin venues:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin venues",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
