"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookingQRCode } from "@/components/booking-qr-code"

interface BookingDetailsProps {
  params: {
    id: string
  }
}

export default function BookingDetailsPage({ params }: BookingDetailsProps) {
  const bookingId = params.id

  // In a real app, you would fetch the booking details from an API
  const bookingDetails = {
    id: bookingId,
    venue: "Hoops Arena",
    location: "Andheri West, Mumbai",
    date: "Friday, 5 April 2024",
    time: "7:00 PM - 8:00 PM",
    court: "Court 2 (Indoor)",
    status: "confirmed",
    amount: "₹550",
    paymentMethod: "Credit Card",
    paymentId: "PAY24050789",
    bookedOn: "2 April 2024, 3:45 PM",
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/profile/bookings"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Bookings
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{bookingDetails.venue}</h2>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      bookingDetails.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : bookingDetails.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bookingDetails.status.charAt(0).toUpperCase() + bookingDetails.status.slice(1)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-green-600" />
                    <span>{bookingDetails.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>{bookingDetails.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>{bookingDetails.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    <span>{bookingDetails.court}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-medium">{bookingDetails.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booked On</span>
                    <span>{bookingDetails.bookedOn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium">{bookingDetails.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>{bookingDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span>{bookingDetails.paymentId}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {bookingDetails.status === "confirmed" && (
                    <Button variant="outline" className="flex-1">
                      Cancel Booking
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href={`/venue/${bookingDetails.id.slice(-1)}`}>Book Again</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Venue Rules</h3>
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

          <div>
            <BookingQRCode bookingId={bookingId} />
          </div>
        </div>
      </div>
    </main>
  )
}
