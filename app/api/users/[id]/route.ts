import { type NextRequest, NextResponse } from "next/server"
import { getUserProfile, updateUserProfile } from "@/lib/database/users"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    console.log("Fetching user profile for ID:", userId)

    const user = await getUserProfile(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const updates = await request.json()

    console.log("Updating user profile for ID:", userId, "with updates:", updates)

    const user = await updateUserProfile(userId, updates)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      {
        error: "Failed to update user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
