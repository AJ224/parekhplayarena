import Link from "next/link"
import { ArrowUpRight, CalendarDays, CreditCard, DollarSign, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminBookingChart } from "@/components/admin/booking-chart"
import { AdminRevenueChart } from "@/components/admin/revenue-chart"
import { AdminRecentBookings } from "@/components/admin/recent-bookings"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,25,650</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,845</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+7.4%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹580</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">-2.3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Booking Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Overview</CardTitle>
              <CardDescription>Number of bookings per day over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AdminBookingChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Total revenue per day over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AdminRevenueChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest bookings across all venues</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bookings">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <AdminRecentBookings />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Popular Venues</CardTitle>
              <CardDescription>Most booked venues this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/venues">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Parekh Arena", location: "Bijapur", bookings: 87, occupancy: 92 },
                // { name: "Green Field", location: "Bijapur", bookings: 76, occupancy: 88 },
                // { name: "Smash Court", location: "Bijapur", bookings: 65, occupancy: 78 },
                // { name: "Cricket Hub", location: "Bijapur", bookings: 54, occupancy: 72 },
                // { name: "Tennis Paradise", location: "Delhi", bookings: 48, occupancy: 65 },
              ].map((venue, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{venue.name}</div>
                    <div className="text-sm text-muted-foreground">{venue.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{venue.bookings} bookings</div>
                    <div className="text-sm text-muted-foreground">{venue.occupancy}% occupancy</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

