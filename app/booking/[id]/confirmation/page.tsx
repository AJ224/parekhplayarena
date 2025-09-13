"use client"
import Link from "next/link"
import { Calendar, MapPin, Share2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BookingQRCode } from "@/components/booking-qr-code"

interface BookingConfirmationProps {
  params: {
    id: string
  }
}

export default function BookingConfirmationPage({ params }: BookingConfirmationProps) {
  const bookingId = params.id || "SPT24050789" // Default for demo

  // In a real app, you would fetch the booking details from an API
  const bookingDetails = {
    id: bookingId,
    venue: "Hoops Arena",
    location: "Andheri West, Mumbai",
    date: "Friday, 5 April 2024",
    time: "7:00 PM - 8:00 PM",
    court: "Court 2 (Indoor)",
    status: "confirmed",
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My SportsSpot Booking",
          text: `I've booked ${bookingDetails.venue} on ${bookingDetails.date} at ${bookingDetails.time.split(" - ")[0]}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  return (
    <main className="container px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-1">Your booking has been successfully confirmed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="font-medium">
                  Booking Reference: <span className="text-green-600">{bookingId}</span>
                </div>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>
                      {bookingDetails.date} • {bookingDetails.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-600" />
                    <span>
                      {bookingDetails.venue}, {bookingDetails.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    <span>{bookingDetails.court}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                A confirmation email and SMS with your booking details and QR code have been sent to your registered
                email address and phone number.
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 px-6 pb-6 pt-0">
              <Button className="w-full" asChild>
                <Link href={`/profile/bookings/${bookingId}`}>View Booking Details</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Booking
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>

          <BookingQRCode bookingId={bookingId} />
        </div>
      </div>
    </main>
  )
}
