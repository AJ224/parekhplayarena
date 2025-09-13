"use client"

import { useState } from "react"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SlotReservationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  slotDetails: {
    court_id: string
    date: string
    start_time: string
    end_time: string
    price?: number
  }
  reservationMinutes?: number
}

export function SlotReservationModal({
  isOpen,
  onClose,
  onConfirm,
  slotDetails,
  reservationMinutes = 15,
}: SlotReservationModalProps) {
  const [isReserving, setIsReserving] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleReserve = async () => {
    setIsReserving(true)
    try {
      // Simulate reservation API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReservationSuccess(true)
      
      // Call the onConfirm callback after successful reservation
      setTimeout(() => {
        onConfirm()
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Reservation failed:", error)
    } finally {
      setIsReserving(false)
    }
  }

  if (reservationSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Slot Reserved!
            </DialogTitle>
            <DialogDescription>
              Your slot has been successfully reserved for {reservationMinutes} minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{formatDate(slotDetails.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time:</span>
                    <span className="text-sm">
                      {formatTime(slotDetails.start_time)} - {formatTime(slotDetails.end_time)}
                    </span>
                  </div>
                  {slotDetails.price && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-sm">₹{Math.floor(slotDetails.price / 100)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reserve Time Slot
          </DialogTitle>
          <DialogDescription>
            Reserve this slot for {reservationMinutes} minutes while you complete your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Slot Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{formatDate(slotDetails.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Time:</span>
                <span className="text-sm">
                  {formatTime(slotDetails.start_time)} - {formatTime(slotDetails.end_time)}
                </span>
              </div>
              {slotDetails.price && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Price:</span>
                  <span className="text-sm font-semibold">₹{Math.floor(slotDetails.price / 100)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Important:</p>
                <p className="text-amber-700 mt-1">
                  This slot will be reserved for {reservationMinutes} minutes. If you don't complete your booking within this time, the slot will be released for others to book.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isReserving}>
            Cancel
          </Button>
          <Button onClick={handleReserve} disabled={isReserving}>
            {isReserving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Reserving...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Reserve Slot
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
