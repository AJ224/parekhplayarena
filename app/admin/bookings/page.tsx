"use client"

import { useState } from "react"
import { Calendar, Check, Clock, Edit, Filter, MoreHorizontal, Search, Trash, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePicker } from "@/components/date-picker"

export default function BookingsPage() {
  const [showFilters, setShowFilters] = useState(false)

  const bookings = [
    {
      id: "SPT24050789",
      user: "Rahul Sharma",
      venue: "Hoops Arena",
      sport: "Basketball",
      date: "05 Apr 2024",
      time: "7:00 PM - 8:00 PM",
      amount: "₹550",
      status: "confirmed",
    },
    {
      id: "SPT24050788",
      user: "Priya Patel",
      venue: "Green Field",
      sport: "Football",
      date: "05 Apr 2024",
      time: "5:00 PM - 6:00 PM",
      amount: "₹800",
      status: "confirmed",
    },
    {
      id: "SPT24050787",
      user: "Amit Kumar",
      venue: "Smash Court",
      sport: "Badminton",
      date: "05 Apr 2024",
      time: "3:00 PM - 4:00 PM",
      amount: "₹400",
      status: "pending",
    },
    {
      id: "SPT24050786",
      user: "Neha Singh",
      venue: "Cricket Hub",
      sport: "Cricket",
      date: "05 Apr 2024",
      time: "1:00 PM - 3:00 PM",
      amount: "₹1200",
      status: "confirmed",
    },
    {
      id: "SPT24050785",
      user: "Vikram Joshi",
      venue: "Tennis Paradise",
      sport: "Tennis",
      date: "05 Apr 2024",
      time: "11:00 AM - 12:00 PM",
      amount: "₹600",
      status: "cancelled",
    },
    {
      id: "SPT24050784",
      user: "Ananya Desai",
      venue: "Hoops Arena",
      sport: "Basketball",
      date: "06 Apr 2024",
      time: "6:00 PM - 7:00 PM",
      amount: "₹550",
      status: "confirmed",
    },
    {
      id: "SPT24050783",
      user: "Rajesh Gupta",
      venue: "Green Field",
      sport: "Football",
      date: "06 Apr 2024",
      time: "4:00 PM - 5:00 PM",
      amount: "₹800",
      status: "confirmed",
    },
    {
      id: "SPT24050782",
      user: "Meera Shah",
      venue: "Smash Court",
      sport: "Badminton",
      date: "06 Apr 2024",
      time: "2:00 PM - 3:00 PM",
      amount: "₹400",
      status: "confirmed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Block Slot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block Time Slot</DialogTitle>
                <DialogDescription>Block a time slot for maintenance or private events</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="block-venue">Venue</Label>
                  <Select>
                    <SelectTrigger id="block-venue">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hoops-arena">Hoops Arena</SelectItem>
                      <SelectItem value="green-field">Green Field</SelectItem>
                      <SelectItem value="smash-court">Smash Court</SelectItem>
                      <SelectItem value="cricket-hub">Cricket Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-court">Court/Field</Label>
                  <Select>
                    <SelectTrigger id="block-court">
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="court-1">Court 1</SelectItem>
                      <SelectItem value="court-2">Court 2</SelectItem>
                      <SelectItem value="court-3">Court 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <DatePicker />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Select>
                      <SelectTrigger id="start-time">
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Select>
                      <SelectTrigger id="end-time">
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-reason">Reason</Label>
                  <Select>
                    <SelectTrigger id="block-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="private-event">Private Event</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-notes">Notes</Label>
                  <Input id="block-notes" placeholder="Additional notes" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Block Slot</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-date">Date</Label>
                <DatePicker />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-venue">Venue</Label>
                <Select>
                  <SelectTrigger id="filter-venue">
                    <SelectValue placeholder="All venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All venues</SelectItem>
                    <SelectItem value="hoops-arena">Hoops Arena</SelectItem>
                    <SelectItem value="green-field">Green Field</SelectItem>
                    <SelectItem value="smash-court">Smash Court</SelectItem>
                    <SelectItem value="cricket-hub">Cricket Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-sport">Sport</Label>
                <Select>
                  <SelectTrigger id="filter-sport">
                    <SelectValue placeholder="All sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sports</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-status">Status</Label>
                <Select>
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by booking ID or user name" className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage all bookings across venues</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.venue}</TableCell>
                  <TableCell>{booking.sport}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status === "confirmed" && <Check className="mr-1 h-3 w-3" />}
                      {booking.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                      {booking.status === "cancelled" && <X className="mr-1 h-3 w-3" />}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Check className="mr-2 h-4 w-4" />
                          Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
