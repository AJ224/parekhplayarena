"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Edit, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

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

  return (
    <main className="container px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Rahul Sharma" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="rahul.sharma@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+91 9876543210" />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => setIsEditing(false)}>
                        Save
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">Rahul Sharma</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-muted-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">rahul.sharma@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-muted-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">+91 9876543210</p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="pt-2">
                  <h3 className="font-medium mb-2">Account Settings</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile/change-password">Change Password</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile/payment-methods">Payment Methods</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile/notifications">Notification Settings</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="upcoming">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
                <TabsTrigger value="past">Past Bookings</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-4 pt-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.venue}</h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center text-sm mt-2">
                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="text-sm mt-2">
                            <span className="text-muted-foreground">Booking ID: </span>
                            <span className="font-medium">{booking.id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          <Button asChild>
                            <Link href={`/booking/${booking.id}`}>View Details</Link>
                          </Button>
                          <Button variant="outline">Cancel Booking</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="past" className="space-y-4 pt-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.venue}</h3>
                            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center text-sm mt-2">
                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="text-sm mt-2">
                            <span className="text-muted-foreground">Booking ID: </span>
                            <span className="font-medium">{booking.id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          <Button asChild>
                            <Link href={`/booking/${booking.id}`}>View Details</Link>
                          </Button>
                          <Button variant="outline">Book Again</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

