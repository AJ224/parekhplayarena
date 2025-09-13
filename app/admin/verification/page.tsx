"use client"
import Link from "next/link"
import { QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Verification</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Verification Portal</CardTitle>
            <CardDescription>Scan QR codes or enter booking IDs to verify customer bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use the verification portal to check in customers when they arrive at the venue. Staff can scan QR codes
              from customer phones or manually enter booking IDs.
            </p>
            <Button asChild>
              <Link href="/verify-booking">
                <QrCode className="mr-2 h-4 w-4" />
                Open Verification Portal
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Instructions</CardTitle>
            <CardDescription>How to verify customer bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">QR Code Scanning</h3>
              <p className="text-sm text-muted-foreground">
                1. Open the verification portal on a device with a camera
                <br />
                2. Click "Scan QR Code"
                <br />
                3. Point the camera at the customer's QR code
                <br />
                4. The system will automatically verify the booking
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Manual Verification</h3>
              <p className="text-sm text-muted-foreground">
                1. Ask the customer for their booking ID
                <br />
                2. Enter the booking ID in the verification portal
                <br />
                3. Click "Verify Booking"
                <br />
                4. Check the verification result
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
            <CardDescription>Recent customer check-ins across all venues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "SPT24050784", user: "Ananya Desai", venue: "Hoops Arena", time: "Today, 6:05 PM" },
                { id: "SPT24050783", user: "Rajesh Gupta", venue: "Green Field", time: "Today, 4:12 PM" },
                { id: "SPT24050782", user: "Meera Shah", venue: "Smash Court", time: "Today, 2:30 PM" },
                { id: "SPT24050781", user: "Vikram Joshi", venue: "Cricket Hub", time: "Today, 1:45 PM" },
                { id: "SPT24050780", user: "Neha Singh", venue: "Tennis Paradise", time: "Today, 11:20 AM" },
              ].map((checkin, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{checkin.user}</div>
                    <div className="text-sm text-muted-foreground">
                      {checkin.venue} • {checkin.id}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{checkin.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
