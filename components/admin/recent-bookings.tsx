"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminRecentBookings() {
  const bookings = [
    {
      id: "SPT24050789",
      user: {
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      venue: "Parekh Arena",
      date: "05 Apr 2024",
      time: "7:00 PM",
      amount: "₹550",
      status: "confirmed",
    },
    {
      id: "SPT24050788",
      user: {
        name: "Priya Patel",
        email: "priya.p@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      venue: "Green Field",
      date: "05 Apr 2024",
      time: "5:00 PM",
      amount: "₹800",
      status: "confirmed",
    },
    {
      id: "SPT24050787",
      user: {
        name: "Amit Kumar",
        email: "amit.k@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      venue: "Smash Court",
      date: "05 Apr 2024",
      time: "3:00 PM",
      amount: "₹400",
      status: "pending",
    },
    {
      id: "SPT24050786",
      user: {
        name: "Neha Singh",
        email: "neha.s@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      venue: "Cricket Hub",
      date: "05 Apr 2024",
      time: "1:00 PM",
      amount: "₹1200",
      status: "confirmed",
    },
    {
      id: "SPT24050785",
      user: {
        name: "Vikram Joshi",
        email: "vikram.j@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      venue: "Tennis Paradise",
      date: "05 Apr 2024",
      time: "11:00 AM",
      amount: "₹600",
      status: "cancelled",
    },
  ]

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={booking.user.avatar} alt={booking.user.name} />
              <AvatarFallback>{booking.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{booking.user.name}</div>
              <div className="text-sm text-muted-foreground">{booking.venue}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div>
                {booking.date}, {booking.time}
              </div>
              <Badge
                variant={
                  booking.status === "confirmed" ? "default" : booking.status === "pending" ? "outline" : "destructive"
                }
              >
                {booking.status}
              </Badge>
            </div>
            <div className="text-sm font-medium">{booking.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

