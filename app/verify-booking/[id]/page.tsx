"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, RefreshCw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface VerifyBookingPageProps {
  params: {
    id: string
  }
}

export default function VerifyBookingByIdPage({ params }: VerifyBookingPageProps) {
  const router = useRouter()
  const bookingId = params.id

  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
    bookingDetails?: any
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const verifyBooking = async () => {
      try {
        // In a real app, you would make an API call to verify the booking
        // For demo purposes, we'll simulate a successful verification

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Demo booking details
        const bookingDetails = {
          id: bookingId,
          venue: "Hoops Arena",
          location: "Andheri West, Mumbai",
          date: "Friday, 5 April 2024",
          time: "7:00 PM - 8:00 PM",
          court: "Court 2 (Indoor)",
          status: "confirmed",
          userName: "Rahul Sharma",
          checkInStatus: bookingId === "SPT24050789" ? "not_checked_in" : "checked_in",
        }

        setVerificationResult({
          success: true,
          message:
            bookingDetails.checkInStatus === "checked_in"
              ? "User has already checked in for this booking."
              : "Booking verified successfully!",
          bookingDetails,
        })

        // If this was a successful first-time check-in, you would update the booking status
        // and send a notification to the user
        if (bookingDetails.checkInStatus === "not_checked_in") {
          // In a real app, you would make an API call to update the booking status
          console.log("Updating booking status to checked_in")

          // In a real app, you would send a notification to the user
          console.log("Sending check-in notification to user")
        }
      } catch (error) {
        console.error("Error verifying booking:", error)
        setVerificationResult({
          success: false,
          message: "Error verifying booking. Please try again.",
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyBooking()
  }, [bookingId])

  return (
    <main className="container px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Booking Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVerifying ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-4">Verifying booking...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {verificationResult?.success ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="h-8 w-8 text-red-600" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3
                    className={`text-lg font-medium ${verificationResult?.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {verificationResult?.success ? "Success!" : "Verification Failed"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{verificationResult?.message}</p>
                </div>

                {verificationResult?.success && verificationResult.bookingDetails && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Booking ID:</span>
                        <span className="font-medium">{verificationResult.bookingDetails.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User:</span>
                        <span>{verificationResult.bookingDetails.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venue:</span>
                        <span>{verificationResult.bookingDetails.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{verificationResult.bookingDetails.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span>{verificationResult.bookingDetails.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Court:</span>
                        <span>{verificationResult.bookingDetails.court}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/verify-booking")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Verify Another Booking
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
