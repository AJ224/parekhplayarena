"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, Info, MapPin, Phone, Share2, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/date-picker"

export default function VenuePage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
  ]

  return (
    <main className="container px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=800" alt="Venue image" fill className="object-cover" />
            <Button variant="outline" size="icon" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">Hoops Arena</h1>
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 mr-1 fill-green-500 text-green-500" />
                4.8 (124 reviews)
              </div>
            </div>
            <div className="flex items-center text-muted-foreground mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Andheri West, Mumbai</span>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4 pt-4">
              <p>
                Hoops Arena is a premium basketball facility featuring 3 professional-grade indoor courts. The venue
                offers state-of-the-art facilities for both casual players and serious athletes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Capacity: 5v5 full court</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>Hours: 6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span>Contact: +91 9876543210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-green-600" />
                  <span>Established: 2018</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <div className="h-[300px] bg-slate-200 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500">Map view would be displayed here</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="amenities" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Wooden Court</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Changing Rooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Shower Facilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Equipment Rental</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Parking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Café</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Drinking Water</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>First Aid</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4 pt-4">
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between">
                      <div className="font-medium">Rahul S.</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Visited on 12 Mar 2023</div>
                    <p className="mt-2 text-sm">
                      Great facility with well-maintained courts. The staff was friendly and helpful. Will definitely
                      come back again for my weekend games.
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Book a Court</h2>

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Select Date</h3>
                <DatePicker />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Select Time Slot</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className="text-xs py-1 h-auto"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Select Court</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="text-xs py-1 h-auto">
                    Court 1
                  </Button>
                  <Button variant="outline" className="text-xs py-1 h-auto">
                    Court 2
                  </Button>
                  <Button variant="outline" className="text-xs py-1 h-auto">
                    Court 3
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Court fee</span>
                  <span>₹500</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹550</span>
                </div>
              </div>

              <Button className="w-full">Proceed to Book</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Court Rules</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                  <span>Proper sports shoes required</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                  <span>Arrive 15 minutes before your slot</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                  <span>Cancellation policy: 24 hours notice for full refund</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                  <span>No food or drinks on the court</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

