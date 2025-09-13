"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const upcomingBookings = [
    {
      id: "SPT24050789",
      venue: "Hoops Arena",
      location: "Andheri West, Mumbai",
      date: "Friday, 5 April 2024",
      time: "7:00 PM - 8:00 PM",
      court: "Court 2 (Indoor)",
      status: "confirmed",
    },
    {
      id: "SPT24050790",
      venue: "Green Field",
      location: "Powai, Mumbai",
      date: "Sunday, 7 April 2024",
      time: "9:00 AM - 11:00 AM",
      court: "Field 1 (Outdoor)",
      status: "confirmed",
    },
  ]

  const pastBookings = [
    {
      id: "SPT24050780",
      venue: "Smash Court",
      location: "Bandra, Mumbai",
      date: "Monday, 1 April 2024",
      time: "6:00 PM - 7:00 PM",
      court: "Court 3",
      status: "completed",
    },
    {
      id: "SPT24050770",
      venue: "Cricket Hub",
      location: "Dadar, Mumbai",
      date: "Saturday, 30 March 2024",
      time: "4:00 PM - 6:00 PM",
      court: "Pitch 2",
      status: "completed",
    },
  ]

  const filteredUpcomingBookings = upcomingBookings.filter(
    (booking) =>
      booking.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPastBookings = pastBookings.filter(
    (booking) =>
      booking.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="container px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredUpcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No upcoming bookings found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Book a court to get started"}
                </p>
                {!searchQuery && (
                  <Button className="mt-4" asChild>
                    <Link href="/">Book Now</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUpcomingBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{booking.venue}</h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{booking.location}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="text-muted-foreground">Booking ID: </span>
                            <span className="font-medium">{booking.id}</span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button asChild>
                            <Link href={`/profile/bookings/${booking.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {filteredPastBookings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No past bookings found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Your booking history will appear here"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPastBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{booking.venue}</h3>
                            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{booking.location}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="text-muted-foreground">Booking ID: </span>
                            <span className="font-medium">{booking.id}</span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" asChild>
                            <Link href={`/profile/bookings/${booking.id}`}>View Details</Link>
                          </Button>
                          <Button asChild>
                            <Link href={`/venue/${booking.id.slice(-1)}`}>Book Again</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
