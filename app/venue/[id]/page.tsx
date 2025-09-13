"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, MapPin, Star, Users, Wifi, Car, Shirt, Coffee, Dumbbell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SlotAvailabilityCalendar } from "@/components/slot-availability-calendar"
import { SlotReservationModal } from "@/components/slot-reservation-modal"
import { DynamicPricingDisplay } from "@/components/dynamic-pricing-display"

interface Venue {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  rating: number
  total_reviews: number
  price_per_hour: number
  images: string[]
  amenities: string[]
  rules: string[]
  opening_time: string
  closing_time: string
  locations?: {
    name: string
    cities?: {
      name: string
      state: string
    }
  }
  sports?: {
    name: string
    description: string
  }
  courts?: Array<{
    id: string
    name: string
    type: string
    capacity: number
    is_active: boolean
  }>
}

const amenityIcons: Record<string, any> = {
  Parking: Car,
  WiFi: Wifi,
  "Changing Rooms": Shirt,
  Café: Coffee,
  "Equipment Rental": Dumbbell,
}

export default function VenuePage() {
  const params = useParams()
  const router = useRouter()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourt, setSelectedCourt] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [reservedSlot, setReservedSlot] = useState<any>(null)

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching venue with ID:", params.id)
        const response = await fetch(`/api/venues/${params.id}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch venue")
        }

        const data = await response.json()
        console.log("Venue data received:", data)

        setVenue(data.venue)

        // Set default court selection
        if (data.venue.courts && data.venue.courts.length > 0) {
          setSelectedCourt(data.venue.courts[0].id)
        }
      } catch (error) {
        console.error("Error fetching venue:", error)
        setError(error instanceof Error ? error.message : "Failed to load venue")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchVenue()
    }
  }, [params.id])

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot.id)
    setSelectedTime(`${slot.time_slots.start_time}-${slot.time_slots.end_time}`)
  }

  const handleReserveSlot = () => {
    if (!selectedCourt || !selectedDate || !selectedSlot) {
      alert("Please select a court, date, and time slot")
      return
    }

    setShowReservationModal(true)
  }

  const handleReservationConfirm = () => {
    setReservedSlot({
      court_id: selectedCourt,
      date: selectedDate,
      start_time: selectedTime.split("-")[0],
      end_time: selectedTime.split("-")[1],
    })
  }

  const handleBookNow = () => {
    if (!selectedCourt || !selectedDate || !selectedTime) {
      alert("Please select a court, date, and time slot")
      return
    }

    const bookingParams = new URLSearchParams({
      venue: params.id as string,
      court: selectedCourt,
      date: selectedDate,
      time: selectedTime,
    })

    router.push(`/booking?${bookingParams.toString()}`)
  }

  const timeSlots = [
    "06:00-07:00",
    "07:00-08:00",
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00",
    "21:00-22:00",
  ]

  if (isLoading) {
    return (
      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Venue</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/search">Back to Search</Link>
          </Button>
        </div>
      </main>
    )
  }

  if (!venue) {
    return (
      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Venue not found</h1>
          <p className="text-muted-foreground mt-2">The venue you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/search">Back to Search</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/search" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to search
          </Link>
        </div>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <Image
              src={venue.images?.[0] || "/placeholder.svg?height=400&width=800&text=Venue+Image"}
              alt={venue.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Venue Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{venue.name}</h1>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {venue.locations?.name ? `${venue.locations.name}, ` : ""}
                        {venue.locations?.cities?.name || venue.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                    <Star className="h-4 w-4 mr-1 fill-green-500 text-green-500" />
                    <span className="font-medium">{venue.rating.toFixed(1)}</span>
                    <span className="text-sm ml-1">({venue.total_reviews} reviews)</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{venue.description}</p>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-green-600" />
                    <span>
                      {venue.opening_time} - {venue.closing_time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-green-600" />
                    <span>{venue.sports?.name}</span>
                  </div>
                </div>
              </div>

              {/* Courts */}
              {venue.courts && venue.courts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Courts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {venue.courts
                        .filter((court) => court.is_active)
                        .map((court) => (
                          <div
                            key={court.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedCourt === court.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedCourt(court.id)}
                          >
                            <h3 className="font-medium">{court.name}</h3>
                            <p className="text-sm text-muted-foreground">{court.type}</p>
                            <p className="text-sm text-muted-foreground">Capacity: {court.capacity} players</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.amenities.map((amenity) => {
                        const IconComponent = amenityIcons[amenity] || Users
                        return (
                          <div key={amenity} className="flex items-center">
                            <IconComponent className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rules */}
              {venue.rules && venue.rules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rules & Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {venue.rules.map((rule, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Book This Venue</CardTitle>
                  <CardDescription>
                    Starting from{" "}
                    <span className="text-2xl font-bold text-green-600">₹{Math.floor(venue.price_per_hour / 100)}</span>
                    /hour
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  {/* Slot Availability Calendar */}
                  {selectedCourt && (
                    <SlotAvailabilityCalendar
                      courtId={selectedCourt}
                      date={selectedDate}
                      onSlotSelect={handleSlotSelect}
                      selectedSlot={selectedSlot}
                      showPricing={true}
                    />
                  )}

                  <Separator />

                  {/* Dynamic Pricing */}
                  {selectedCourt && selectedSlot && (
                    <DynamicPricingDisplay
                      venueId={venue.id}
                      courtId={selectedCourt}
                      date={selectedDate}
                      startTime={selectedTime.split("-")[0]}
                      endTime={selectedTime.split("-")[1]}
                      basePrice={venue.price_per_hour}
                      showComparison={true}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {!reservedSlot ? (
                      <Button 
                        className="w-full" 
                        onClick={handleReserveSlot}
                        disabled={!selectedCourt || !selectedDate || !selectedSlot}
                      >
                        Reserve Slot (15 min)
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            ✓ Slot Reserved for 15 minutes
                          </p>
                        </div>
                        <Button className="w-full" onClick={handleBookNow}>
                          Complete Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Address:</span>
                    <p className="text-muted-foreground">{venue.address}</p>
                  </div>
                  {venue.phone && (
                    <div className="text-sm">
                      <span className="font-medium">Phone:</span>
                      <p className="text-muted-foreground">{venue.phone}</p>
                    </div>
                  )}
                  {venue.email && (
                    <div className="text-sm">
                      <span className="font-medium">Email:</span>
                      <p className="text-muted-foreground">{venue.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Reservation Modal */}
      <SlotReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onConfirm={handleReservationConfirm}
        slotDetails={{
          court_id: selectedCourt,
          date: selectedDate,
          start_time: selectedTime.split("-")[0],
          end_time: selectedTime.split("-")[1],
          price: venue?.price_per_hour,
        }}
        reservationMinutes={15}
      />
    </main>
  )
}
