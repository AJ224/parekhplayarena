"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Booking {
  id: string
  booking_reference: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  status: string
  venues?: {
    name: string
    address: string
  }
  courts?: {
    name: string
    type: string
  }
  users?: {
    full_name?: string
    email: string
    phone?: string
  }
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/admin/bookings?limit=5")
        if (!response.ok) {
          throw new Error("Failed to fetch recent bookings")
        }

        const data = await response.json()
        setBookings(data.bookings || [])
      } catch (error) {
        console.error("Error fetching recent bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentBookings()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent bookings found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{booking.venues?.name || "Unknown Venue"}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{booking.venues?.address || "Address not available"}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {new Date(booking.booking_date).toLocaleDateString()} • {booking.start_time}-{booking.end_time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {booking.users?.full_name || booking.users?.email || "Unknown Customer"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">₹{Math.floor(booking.total_amount / 100)}</div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {booking.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
