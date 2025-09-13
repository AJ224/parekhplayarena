"use client"

import { useState } from "react"
import { QrScanner } from "@yudiel/react-qr-scanner"
import { Check, QrCode, RefreshCw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyBookingPage() {
  const [scanMode, setScanMode] = useState(false)
  const [manualBookingId, setManualBookingId] = useState("")
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
    booking?: any
    alreadyCheckedIn?: boolean
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleScan = async (result: string) => {
    if (isVerifying) return

    try {
      setIsVerifying(true)

      // Extract booking ID from the scanned URL
      const bookingId = result.split("/").pop()

      if (!bookingId) {
        setVerificationResult({
          success: false,
          message: "Invalid QR code. Please try again.",
        })
        return
      }

      await verifyBooking(bookingId)
    } catch (error) {
      console.error("Error scanning QR code:", error)
      setVerificationResult({
        success: false,
        message: "Error scanning QR code. Please try again.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleManualVerify = async () => {
    if (!manualBookingId.trim() || isVerifying) return

    try {
      setIsVerifying(true)
      await verifyBooking(manualBookingId)
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

  const verifyBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/verify`, {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setVerificationResult({
          success: true,
          message: result.message,
          booking: result.booking,
          alreadyCheckedIn: result.alreadyCheckedIn,
        })
      } else {
        setVerificationResult({
          success: false,
          message: result.error || "Verification failed",
        })
      }
    } catch (error) {
      console.error("Error verifying booking:", error)
      setVerificationResult({
        success: false,
        message: "Network error. Please try again.",
      })
    }
  }

  const resetVerification = () => {
    setVerificationResult(null)
    setManualBookingId("")
    setScanMode(false)
  }

  return (
    <main className="container px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Verify Booking</CardTitle>
            <CardDescription>Scan QR code or enter booking ID to verify</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!verificationResult ? (
              <>
                {scanMode ? (
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <QrScanner
                      onDecode={handleScan}
                      onError={(error) => console.error(error)}
                      containerStyle={{ borderRadius: "0.5rem" }}
                    />
                    <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setScanMode(false)}>
                      Enter Booking ID Manually
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="booking-id">Booking ID</Label>
                      <Input
                        id="booking-id"
                        placeholder="Enter booking ID (e.g., SPT24050789)"
                        value={manualBookingId}
                        onChange={(e) => setManualBookingId(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleManualVerify}
                      disabled={!manualBookingId.trim() || isVerifying}
                    >
                      {isVerifying ? "Verifying..." : "Verify Booking"}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setScanMode(true)}>
                      <QrCode className="mr-2 h-4 w-4" />
                      Scan QR Code
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {verificationResult.success ? (
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
                    className={`text-lg font-medium ${verificationResult.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {verificationResult.success ? "Success!" : "Verification Failed"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{verificationResult.message}</p>
                </div>

                {verificationResult.success && verificationResult.booking && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Booking ID:</span>
                        <span className="font-medium">{verificationResult.booking.booking_reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User:</span>
                        <span>
                          {verificationResult.booking.users?.full_name || verificationResult.booking.users?.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venue:</span>
                        <span>{verificationResult.booking.venues?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(verificationResult.booking.booking_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span>
                          {verificationResult.booking.start_time} - {verificationResult.booking.end_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Court:</span>
                        <span>{verificationResult.booking.courts?.name}</span>
                      </div>
                      {verificationResult.alreadyCheckedIn && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in Time:</span>
                          <span>{new Date(verificationResult.booking.check_in_time).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {verificationResult && (
              <Button variant="outline" className="w-full bg-transparent" onClick={resetVerification}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verify Another Booking
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
