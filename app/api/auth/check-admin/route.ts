import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Get the session from the request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Use service role client to verify the JWT token
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    console.log("Authenticated user:", user.id, user.email)

    // Use service role client to check admin status (RLS is disabled, so this should work)
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    console.log("Admin check result:", { adminUser, adminError })

    if (adminError || !adminUser) {
      console.error("Admin check failed:", adminError)
      return NextResponse.json(
        { error: "User is not an admin" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      admin: adminUser
    })
  } catch (error) {
    console.error("Error checking admin status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
