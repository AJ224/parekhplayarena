"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface BookingQRCodeProps {
  bookingId: string
  qrCodeUrl?: string
}

export function BookingQRCode({ bookingId, qrCodeUrl: initialQrCodeUrl }: BookingQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(initialQrCodeUrl || null)
  const [isLoading, setIsLoading] = useState(!initialQrCodeUrl)

  useEffect(() => {
    if (!initialQrCodeUrl) {
      const fetchQRCode = async () => {
        try {
          const response = await fetch(`/api/bookings/${bookingId}/qr-code`)
          if (!response.ok) throw new Error("Failed to fetch QR code")
          const data = await response.json()
          setQrCodeUrl(data.qrCodeUrl)
        } catch (error) {
          console.error("Error fetching QR code:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchQRCode()
    }
  }, [bookingId, initialQrCodeUrl])

  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `booking-${bookingId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg">Booking QR Code</h3>
          <p className="text-sm text-muted-foreground">Show this QR code at the venue for check-in</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          {isLoading ? (
            <Skeleton className="w-[250px] h-[250px]" />
          ) : qrCodeUrl ? (
            <div className="relative w-[250px] h-[250px]">
              <Image
                src={qrCodeUrl || "/placeholder.svg"}
                alt={`QR Code for booking ${bookingId}`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 text-gray-500">
              QR code not available
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground">Booking ID: {bookingId}</p>
        </div>

        <Button onClick={handleDownload} disabled={!qrCodeUrl || isLoading} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  )
}
