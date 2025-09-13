"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, CreditCard, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "card",
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  // Get booking details from URL params (in a real app, this would come from the booking flow)
  const venueId = searchParams.get("venue") || "1"
  const courtId = searchParams.get("court") || "1"
  const date = searchParams.get("date") || "2024-04-05"
  const time = searchParams.get("time") || "19:00-20:00"

  // Mock venue data (in real app, this would be fetched from database)
  const venueDetails = {
    name: "Hoops Arena",
    location: "Andheri West, Mumbai",
    court: "Court 2 (Indoor)",
    date: "Friday, 5 April 2024",
    time: "7:00 PM - 8:00 PM",
    courtFee: 500,
    serviceFee: 50,
    total: 550,
  }

  const handleInputChange = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBookingSubmit = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would get the user ID from authentication
      const userId = "user-id-placeholder" // This should come from auth context

      const bookingPayload = {
        user_id: userId,
        venue_id: venueId,
        court_id: courtId,
        booking_date: date,
        start_time: time.split("-")[0],
        end_time: time.split("-")[1],
        total_amount: venueDetails.total * 100, // Convert to paise
        service_fee: venueDetails.serviceFee * 100,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const result = await response.json()

      if (result.success) {
        // Redirect to confirmation page
        router.push(`/booking/${result.booking.id}/confirmation`)
      } else {
        throw new Error(result.error || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/venue/1" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to venue
          </Link>
        </div>

        <div className="relative mb-8">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-green-600" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <span className="text-xs">Details</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? "text-green-600" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="text-xs">Payment</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? "text-green-600" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
              <span className="text-xs">Confirmation</span>
            </div>
          </div>
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-muted -z-10">
            <div className="h-full bg-green-600 transition-all" style={{ width: `${(step - 1) * 50}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Review your booking information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-32 rounded overflow-hidden flex-shrink-0">
                    <Image src="/placeholder.svg?height=80&width=120" alt="Venue image" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{venueDetails.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{venueDetails.location}</span>
                    </div>
                    <div className="flex items-center text-sm mt-2">
                      <Calendar className="h-4 w-4 mr-1 text-green-600" />
                      <span>
                        {venueDetails.date} • {venueDetails.time}
                      </span>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Users className="h-4 w-4 mr-1 text-green-600" />
                      <span>{venueDetails.court}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={bookingData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Court fee (1 hour)</span>
                    <span>₹{venueDetails.courtFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹{venueDetails.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{venueDetails.total}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!bookingData.fullName || !bookingData.email || !bookingData.phone}
                >
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Choose your payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs
                  value={bookingData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="Enter name on card" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="upi" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input id="upiId" placeholder="yourname@upi" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      You will receive a payment request on your UPI app.
                    </div>
                  </TabsContent>
                  <TabsContent value="wallet" className="space-y-4 pt-4">
                    <RadioGroup defaultValue="paytm">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paytm" id="paytm" />
                        <Label htmlFor="paytm">Paytm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phonepe" id="phonepe" />
                        <Label htmlFor="phonepe">PhonePe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amazonpay" id="amazonpay" />
                        <Label htmlFor="amazonpay">Amazon Pay</Label>
                      </div>
                    </RadioGroup>
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Court fee (1 hour)</span>
                    <span>₹{venueDetails.courtFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹{venueDetails.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{venueDetails.total}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" onClick={handleBookingSubmit} disabled={isLoading}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : `Pay ₹${venueDetails.total}`}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep(1)}>
                  Back
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
