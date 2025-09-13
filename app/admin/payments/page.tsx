"use client"

import { useState } from "react"
import { Check, CreditCard, Edit, MoreHorizontal, Plus, Search, Tag, Trash, X, Clock } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/date-picker"

export default function PaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: "PAY24050789",
      bookingId: "SPT24050789",
      user: "Rahul Sharma",
      date: "05 Apr 2024",
      amount: "₹550",
      method: "Credit Card",
      status: "completed",
    },
    {
      id: "PAY24050788",
      bookingId: "SPT24050788",
      user: "Priya Patel",
      date: "05 Apr 2024",
      amount: "₹800",
      method: "UPI",
      status: "completed",
    },
    {
      id: "PAY24050787",
      bookingId: "SPT24050787",
      user: "Amit Kumar",
      date: "05 Apr 2024",
      amount: "₹400",
      method: "Wallet",
      status: "pending",
    },
    {
      id: "PAY24050786",
      bookingId: "SPT24050786",
      user: "Neha Singh",
      date: "05 Apr 2024",
      amount: "₹1200",
      method: "Credit Card",
      status: "completed",
    },
    {
      id: "PAY24050785",
      bookingId: "SPT24050785",
      user: "Vikram Joshi",
      date: "05 Apr 2024",
      amount: "₹600",
      method: "UPI",
      status: "refunded",
    },
    {
      id: "PAY24050784",
      bookingId: "SPT24050784",
      user: "Ananya Desai",
      date: "06 Apr 2024",
      amount: "₹550",
      method: "Credit Card",
      status: "completed",
    },
    {
      id: "PAY24050783",
      bookingId: "SPT24050783",
      user: "Rajesh Gupta",
      date: "06 Apr 2024",
      amount: "₹800",
      method: "Wallet",
      status: "completed",
    },
  ])

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "WELCOME20",
      discount: "20%",
      maxDiscount: "₹200",
      validFrom: "01 Apr 2024",
      validTo: "30 Apr 2024",
      usageLimit: 1000,
      usageCount: 245,
      active: true,
    },
    {
      id: 2,
      code: "SUMMER10",
      discount: "10%",
      maxDiscount: "₹100",
      validFrom: "01 May 2024",
      validTo: "31 Jul 2024",
      usageLimit: 2000,
      usageCount: 0,
      active: true,
    },
    {
      id: 3,
      code: "CRICKET15",
      discount: "15%",
      maxDiscount: "₹150",
      validFrom: "01 Apr 2024",
      validTo: "30 Jun 2024",
      usageLimit: 500,
      usageCount: 78,
      active: true,
    },
    {
      id: 4,
      code: "FIRSTGAME",
      discount: "₹100",
      maxDiscount: "₹100",
      validFrom: "01 Apr 2024",
      validTo: "31 Dec 2024",
      usageLimit: 5000,
      usageCount: 312,
      active: true,
    },
    {
      id: 5,
      code: "WEEKEND25",
      discount: "25%",
      maxDiscount: "₹250",
      validFrom: "01 Mar 2024",
      validTo: "31 Mar 2024",
      usageLimit: 1000,
      usageCount: 876,
      active: false,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment & Coupon Management</h1>
      </div>

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Manage all payment transactions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by payment ID or user" className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <DatePicker />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.bookingId}</TableCell>
                      <TableCell>{payment.user}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : payment.status === "refunded"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status === "completed" && <Check className="mr-1 h-3 w-3" />}
                          {payment.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                          {payment.status === "refunded" && <CreditCard className="mr-1 h-3 w-3" />}
                          {payment.status === "failed" && <X className="mr-1 h-3 w-3" />}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
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
                              <CreditCard className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Process Refund
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
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Coupons</CardTitle>
                <CardDescription>Manage discount coupons and promotional offers</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Coupon</DialogTitle>
                    <DialogDescription>Create a new discount coupon for users</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="coupon-code">Coupon Code</Label>
                      <Input id="coupon-code" placeholder="Enter coupon code" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discount-type">Discount Type</Label>
                        <Select>
                          <SelectTrigger id="discount-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount-value">Discount Value</Label>
                        <Input id="discount-value" placeholder="Enter value" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-discount">Maximum Discount (₹)</Label>
                      <Input id="max-discount" placeholder="Enter maximum discount" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valid From</Label>
                        <DatePicker />
                      </div>
                      <div className="space-y-2">
                        <Label>Valid To</Label>
                        <DatePicker />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usage-limit">Usage Limit</Label>
                      <Input id="usage-limit" type="number" placeholder="Enter usage limit" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coupon-description">Description</Label>
                      <Input id="coupon-description" placeholder="Enter coupon description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applicable-sports">Applicable Sports</Label>
                      <Select>
                        <SelectTrigger id="applicable-sports">
                          <SelectValue placeholder="Select sports" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sports</SelectItem>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="cricket">Cricket</SelectItem>
                          <SelectItem value="badminton">Badminton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="coupon-active" defaultChecked />
                      <Label htmlFor="coupon-active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Coupon</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Max Discount</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>{coupon.discount}</TableCell>
                      <TableCell>{coupon.maxDiscount}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>From: {coupon.validFrom}</span>
                          <span>To: {coupon.validTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.usageCount} / {coupon.usageLimit}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            coupon.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {coupon.active ? "Active" : "Inactive"}
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
                              <Tag className="mr-2 h-4 w-4" />
                              {coupon.active ? "Deactivate" : "Activate"}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
