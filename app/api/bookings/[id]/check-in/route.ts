import { type NextRequest, NextResponse } from "next/server"
import { sendCheckInNotification } from "@/services/notification-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id

    // In a real app, you would:
    // 1. Verify that the booking exists
    // 2. Check if the booking has already been checked in
    // 3. Update the booking status to checked in
    // 4. Send a notification to the user

    // For demo purposes, we'll simulate a successful check-in

    // Simulate database update delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Demo booking details
    const bookingDetails = {
      id: bookingId,
      venue: "Hoops Arena",
      location: "Andheri West, Mumbai",
      date: "Friday, 5 April 2024",
      time: "7:00 PM - 8:00 PM",
      court: "Court 2 (Indoor)",
      status: "confirmed",
      userName: "Rahul Sharma",
      userEmail: "rahul.sharma@example.com",
      userPhone: "+919876543210",
    }

    // Send check-in notification
    await sendCheckInNotification(
      bookingId,
      bookingDetails.userEmail,
      bookingDetails.userPhone,
      bookingDetails.venue,
      bookingDetails.date,
      bookingDetails.time,
    )

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      bookingDetails,
    })
  } catch (error) {
    console.error("Error checking in booking:", error)
    return NextResponse.json({ error: "Failed to check in booking" }, { status: 500 })
  }
}
