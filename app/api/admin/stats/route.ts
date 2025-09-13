import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching admin dashboard stats...")

    // Get total bookings
    const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true })

    // Get total revenue
    const { data: revenueData } = await supabase
      .from("bookings")
      .select("total_amount")
      .eq("payment_status", "completed")

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0

    // Get active users (users who made bookings in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: activeUsersData } = await supabase
      .from("bookings")
      .select("user_id")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const activeUsers = new Set(activeUsersData?.map((b) => b.user_id) || []).size

    // Get today's bookings
    const today = new Date().toISOString().split("T")[0]
    const { count: bookingsToday } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`)

    // Get today's revenue
    const { data: todayRevenueData } = await supabase
      .from("bookings")
      .select("total_amount")
      .eq("payment_status", "completed")
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`)

    const revenueToday = todayRevenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0

    // Get this month's data
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const { count: bookingsThisMonth } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstDayOfMonth.toISOString())

    const { data: monthRevenueData } = await supabase
      .from("bookings")
      .select("total_amount")
      .eq("payment_status", "completed")
      .gte("created_at", firstDayOfMonth.toISOString())

    const revenueThisMonth = monthRevenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0

    // Calculate average booking value
    const averageBookingValue = totalBookings && totalBookings > 0 ? Math.floor(totalRevenue / totalBookings) : 0

    const stats = {
      totalBookings: totalBookings || 0,
      totalRevenue,
      activeUsers,
      averageBookingValue,
      bookingsToday: bookingsToday || 0,
      revenueToday,
      bookingsThisMonth: bookingsThisMonth || 0,
      revenueThisMonth,
    }

    console.log("Admin stats fetched:", stats)

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
