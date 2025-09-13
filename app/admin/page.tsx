"use client"

import { useState, useEffect } from "react"
import { Calendar, DollarSign, Users, TrendingUp, MapPin, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  averageBookingValue: number
  bookingsToday: number
  revenueToday: number
  bookingsThisMonth: number
  revenueThisMonth: number
}

interface Booking {
  id: string
  booking_reference: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  status: string
  venues?: {
    name: string
    address: string
  }
  courts?: {
    name: string
    type: string
  }
  users?: {
    full_name?: string
    email: string
    phone?: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching admin dashboard data...")

        // Fetch stats
        const statsResponse = await fetch("/api/admin/stats")
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats")
        }
        const statsData = await statsResponse.json()
        console.log("Stats data received:", statsData)
        setStats(statsData.stats)

        // Fetch recent bookings
        const bookingsResponse = await fetch("/api/admin/bookings?limit=5")
        if (!bookingsResponse.ok) {
          throw new Error("Failed to fetch recent bookings")
        }
        const bookingsData = await bookingsResponse.json()
        console.log("Recent bookings data received:", bookingsData)
        setRecentBookings(bookingsData.bookings || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Here's an overview of your sports venue booking platform.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{stats?.bookingsToday} today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{stats ? Math.floor(stats.totalRevenue / 100).toLocaleString() : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +₹{stats ? Math.floor(stats.revenueToday / 100) : 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats ? Math.floor(stats.averageBookingValue / 100) : 0}</div>
                <p className="text-xs text-muted-foreground">Per booking</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest bookings from your platform</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{booking.venues?.name || "Unknown Venue"}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{booking.venues?.address || "Address not available"}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {booking.start_time} - {booking.end_time}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span>Customer: {booking.users?.full_name || booking.users?.email || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{Math.floor(booking.total_amount / 100)}</div>
                        <div className="text-xs text-muted-foreground">{booking.booking_reference}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>This month vs last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Bookings This Month:</span>
                    <span className="font-medium">{stats?.bookingsThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue This Month:</span>
                    <span className="font-medium">
                      ₹{stats ? Math.floor(stats.revenueThisMonth / 100).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. per Booking:</span>
                    <span className="font-medium">
                      ₹
                      {stats && stats.bookingsThisMonth > 0
                        ? Math.floor(stats.revenueThisMonth / stats.bookingsThisMonth / 100)
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
                <CardDescription>Real-time stats for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Bookings Today:</span>
                    <span className="font-medium">{stats?.bookingsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Today:</span>
                    <span className="font-medium">₹{stats ? Math.floor(stats.revenueToday / 100) : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-medium">{stats?.activeUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Complete platform statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Total Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Bookings:</span>
                      <span>{stats?.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span>₹{stats ? Math.floor(stats.totalRevenue / 100).toLocaleString() : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users:</span>
                      <span>{stats?.activeUsers}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">This Month</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Bookings:</span>
                      <span>{stats?.bookingsThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span>₹{stats ? Math.floor(stats.revenueThisMonth / 100).toLocaleString() : 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Today</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Bookings:</span>
                      <span>{stats?.bookingsToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span>₹{stats ? Math.floor(stats.revenueToday / 100) : 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
