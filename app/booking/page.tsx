"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, CreditCard, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookingPage() {
  const [step, setStep] = useState(1)

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
                    <h3 className="font-semibold">Hoops Arena</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Andheri West, Mumbai</span>
                    </div>
                    <div className="flex items-center text-sm mt-2">
                      <Calendar className="h-4 w-4 mr-1 text-green-600" />
                      <span>Friday, 5 April 2024 • 7:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Users className="h-4 w-4 mr-1 text-green-600" />
                      <span>Court 2 (Indoor)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Court fee (1 hour)</span>
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
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setStep(2)}>
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
                <Tabs defaultValue="card">
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" onClick={() => setStep(3)}>
                  <CreditCard className="mr-2 h-4 w-4" /> Pay ₹550
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                  Back
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
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
                <div>
                  <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mt-1">Your booking has been successfully confirmed.</p>
                </div>

                <div className="bg-muted p-4 rounded-lg text-left">
                  <div className="font-medium">
                    Booking Reference: <span className="text-green-600">SPT24050789</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span>Friday, 5 April 2024 • 7:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span>Hoops Arena, Andheri West, Mumbai</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-600" />
                      <span>Court 2 (Indoor)</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address.
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full">Download Booking Details</Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

