"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  slot_duration_minutes: number
  price_per_slot: number
}

interface SlotAvailability {
  id: string
  court_id: string
  date: string
  time_slot_id: string
  is_available: boolean
  booking_id?: string
  blocked_reason?: string
  version: number
  time_slots?: TimeSlot
}

interface SlotAvailabilityCalendarProps {
  courtId: string
  date: string
  onSlotSelect?: (slot: SlotAvailability) => void
  selectedSlot?: string
  showPricing?: boolean
}

export function SlotAvailabilityCalendar({
  courtId,
  date,
  onSlotSelect,
  selectedSlot,
  showPricing = true,
}: SlotAvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<SlotAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `/api/slots/availability?court_id=${courtId}&date=${date}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch slot availability")
        }

        const data = await response.json()
        setAvailability(data.availability || [])
      } catch (err) {
        console.error("Error fetching slot availability:", err)
        setError(err instanceof Error ? err.message : "Failed to load availability")
      } finally {
        setIsLoading(false)
      }
    }

    if (courtId && date) {
      fetchAvailability()
    }
  }, [courtId, date])

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatPrice = (price: number) => {
    return `₹${Math.floor(price / 100)}`
  }

  const getSlotStatus = (slot: SlotAvailability) => {
    if (!slot.is_available) {
      if (slot.blocked_reason) {
        return { status: "blocked", label: "Blocked", color: "bg-gray-100 text-gray-500" }
      }
      return { status: "booked", label: "Booked", color: "bg-red-100 text-red-600" }
    }
    return { status: "available", label: "Available", color: "bg-green-100 text-green-600" }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Slot Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Slot Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availability.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Slot Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No time slots available for this date
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Slot Availability
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a time slot for {new Date(date).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availability.map((slot) => {
            const slotStatus = getSlotStatus(slot)
            const isSelected = selectedSlot === slot.id
            const isClickable = slot.is_available && onSlotSelect

            return (
              <Button
                key={slot.id}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col items-center gap-1 ${
                  !isClickable ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => isClickable && onSlotSelect?.(slot)}
                disabled={!isClickable}
              >
                <div className="text-sm font-medium">
                  {slot.time_slots && formatTime(slot.time_slots.start_time)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {slot.time_slots && formatTime(slot.time_slots.end_time)}
                </div>
                {showPricing && slot.time_slots && (
                  <div className="text-xs font-medium">
                    {formatPrice(slot.time_slots.price_per_slot)}
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className={`text-xs ${slotStatus.color}`}
                >
                  {slotStatus.label}
                </Badge>
              </Button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded" />
            <span className="text-xs text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded" />
            <span className="text-xs text-muted-foreground">Blocked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
