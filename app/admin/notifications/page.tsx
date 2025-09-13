"use client"

import { useState } from "react"
import { Bell, Edit, Mail, MoreHorizontal, Plus, Trash } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

export default function NotificationsPage() {
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: "Booking Confirmation",
      subject: "Your booking is confirmed!",
      type: "email",
      trigger: "booking_confirmed",
      active: true,
    },
    {
      id: 2,
      name: "Booking Reminder",
      subject: "Reminder: Your upcoming booking",
      type: "email",
      trigger: "booking_reminder",
      active: true,
    },
    {
      id: 3,
      name: "Booking Cancellation",
      subject: "Your booking has been cancelled",
      type: "email",
      trigger: "booking_cancelled",
      active: true,
    },
    {
      id: 4,
      name: "Payment Confirmation",
      subject: "Payment received for your booking",
      type: "email",
      trigger: "payment_confirmed",
      active: true,
    },
    {
      id: 5,
      name: "Refund Processed",
      subject: "Your refund has been processed",
      type: "email",
      trigger: "refund_processed",
      active: true,
    },
    {
      id: 6,
      name: "Welcome Email",
      subject: "Welcome to SportsSpot!",
      type: "email",
      trigger: "user_registered",
      active: true,
    },
  ])

  const [smsTemplates, setSmsTemplates] = useState([
    {
      id: 1,
      name: "Booking Confirmation SMS",
      content: "Your booking at {venue} on {date} at {time} is confirmed. Booking ID: {booking_id}",
      type: "sms",
      trigger: "booking_confirmed",
      active: true,
    },
    {
      id: 2,
      name: "Booking Reminder SMS",
      content: "Reminder: Your booking at {venue} is tomorrow at {time}. Booking ID: {booking_id}",
      type: "sms",
      trigger: "booking_reminder",
      active: true,
    },
    {
      id: 3,
      name: "Booking Cancellation SMS",
      content: "Your booking at {venue} on {date} at {time} has been cancelled. Booking ID: {booking_id}",
      type: "sms",
      trigger: "booking_cancelled",
      active: true,
    },
    {
      id: 4,
      name: "OTP Verification",
      content: "Your OTP for SportsSpot is {otp}. Valid for 10 minutes.",
      type: "sms",
      trigger: "otp_verification",
      active: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications & Email Templates</h1>
      </div>

      <Tabs defaultValue="email">
        <TabsList>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Manage email templates for various notifications</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add Email Template</DialogTitle>
                    <DialogDescription>Create a new email template for notifications</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input id="template-name" placeholder="Enter template name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-subject">Email Subject</Label>
                      <Input id="template-subject" placeholder="Enter email subject" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-trigger">Trigger Event</Label>
                      <Select>
                        <SelectTrigger id="template-trigger">
                          <SelectValue placeholder="Select trigger event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking_confirmed">Booking Confirmed</SelectItem>
                          <SelectItem value="booking_reminder">Booking Reminder</SelectItem>
                          <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                          <SelectItem value="payment_confirmed">Payment Confirmed</SelectItem>
                          <SelectItem value="refund_processed">Refund Processed</SelectItem>
                          <SelectItem value="user_registered">User Registered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-content">Email Content</Label>
                      <Textarea
                        id="template-content"
                        placeholder="Enter email content"
                        className="min-h-[300px] font-mono"
                      />
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Available Variables</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <code>{"{user_name}"}</code> - User's name
                        </div>
                        <div>
                          <code>{"{booking_id}"}</code> - Booking ID
                        </div>
                        <div>
                          <code>{"{venue}"}</code> - Venue name
                        </div>
                        <div>
                          <code>{"{date}"}</code> - Booking date
                        </div>
                        <div>
                          <code>{"{time}"}</code> - Booking time
                        </div>
                        <div>
                          <code>{"{amount}"}</code> - Payment amount
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="template-active" defaultChecked />
                      <Label htmlFor="template-active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Trigger Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <div className="capitalize">{template.trigger.replace(/_/g, " ")}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            template.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {template.active ? "Active" : "Inactive"}
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
                              <Mail className="mr-2 h-4 w-4" />
                              Send Test
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="mr-2 h-4 w-4" />
                              {template.active ? "Deactivate" : "Activate"}
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

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>SMS Templates</CardTitle>
                <CardDescription>Manage SMS templates for various notifications</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add SMS Template</DialogTitle>
                    <DialogDescription>Create a new SMS template for notifications</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-name">Template Name</Label>
                      <Input id="sms-name" placeholder="Enter template name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-trigger">Trigger Event</Label>
                      <Select>
                        <SelectTrigger id="sms-trigger">
                          <SelectValue placeholder="Select trigger event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking_confirmed">Booking Confirmed</SelectItem>
                          <SelectItem value="booking_reminder">Booking Reminder</SelectItem>
                          <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                          <SelectItem value="otp_verification">OTP Verification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-content">SMS Content</Label>
                      <Textarea id="sms-content" placeholder="Enter SMS content (max 160 characters)" maxLength={160} />
                      <p className="text-xs text-muted-foreground text-right">Max 160 characters</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Available Variables</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <code>{"{user_name}"}</code> - User's name
                        </div>
                        <div>
                          <code>{"{booking_id}"}</code> - Booking ID
                        </div>
                        <div>
                          <code>{"{venue}"}</code> - Venue name
                        </div>
                        <div>
                          <code>{"{date}"}</code> - Booking date
                        </div>
                        <div>
                          <code>{"{time}"}</code> - Booking time
                        </div>
                        <div>
                          <code>{"{otp}"}</code> - OTP code
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sms-active" defaultChecked />
                      <Label htmlFor="sms-active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Trigger Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smsTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{template.content}</TableCell>
                      <TableCell>
                        <div className="capitalize">{template.trigger.replace(/_/g, " ")}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            template.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {template.active ? "Active" : "Inactive"}
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
                              <Mail className="mr-2 h-4 w-4" />
                              Send Test
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="mr-2 h-4 w-4" />
                              {template.active ? "Deactivate" : "Activate"}
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

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Confirmation</h4>
                        <p className="text-sm text-muted-foreground">Send email when a booking is confirmed</p>
                      </div>
                      <Switch id="email-booking-confirmation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Reminder</h4>
                        <p className="text-sm text-muted-foreground">Send reminder email before booking</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="24">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6 hours</SelectItem>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="48">48 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <Switch id="email-booking-reminder" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Cancellation</h4>
                        <p className="text-sm text-muted-foreground">Send email when a booking is cancelled</p>
                      </div>
                      <Switch id="email-booking-cancellation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Confirmation</h4>
                        <p className="text-sm text-muted-foreground">Send email when payment is received</p>
                      </div>
                      <Switch id="email-payment-confirmation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Promotional Emails</h4>
                        <p className="text-sm text-muted-foreground">Send promotional offers and updates</p>
                      </div>
                      <Switch id="email-promotional" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Confirmation</h4>
                        <p className="text-sm text-muted-foreground">Send SMS when a booking is confirmed</p>
                      </div>
                      <Switch id="sms-booking-confirmation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Reminder</h4>
                        <p className="text-sm text-muted-foreground">Send reminder SMS before booking</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="2">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="3">3 hours</SelectItem>
                            <SelectItem value="6">6 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <Switch id="sms-booking-reminder" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Cancellation</h4>
                        <p className="text-sm text-muted-foreground">Send SMS when a booking is cancelled</p>
                      </div>
                      <Switch id="sms-booking-cancellation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">OTP Verification</h4>
                        <p className="text-sm text-muted-foreground">Send OTP for account verification</p>
                      </div>
                      <Switch id="sms-otp" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Promotional SMS</h4>
                        <p className="text-sm text-muted-foreground">Send promotional offers and updates</p>
                      </div>
                      <Switch id="sms-promotional" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
