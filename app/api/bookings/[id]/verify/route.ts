import { type NextRequest, NextResponse } from "next/server"
import { getBookingById, updateBookingCheckIn } from "@/lib/database/bookings"
import { sendCheckInNotification } from "@/services/notification-service"
import { createNotification } from "@/lib/database/users"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id

    // Get booking details
    const booking = await getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if booking is valid for check-in
    if (booking.status !== "confirmed") {
      return NextResponse.json(
        {
          error: "Booking is not confirmed",
          booking: booking,
        },
        { status: 400 },
      )
    }

    // Check if already checked in
    if (booking.check_in_status === "checked_in") {
      return NextResponse.json({
        success: true,
        message: "User has already checked in for this booking.",
        booking: booking,
        alreadyCheckedIn: true,
      })
    }

    // Update check-in status
    const updatedBooking = await updateBookingCheckIn(bookingId)

    // Send check-in notification
    if (updatedBooking.users?.email && updatedBooking.venues?.name) {
      await sendCheckInNotification(
        updatedBooking.booking_reference,
        updatedBooking.users.email,
        updatedBooking.users.phone || "",
        updatedBooking.venues.name,
        updatedBooking.booking_date,
        `${updatedBooking.start_time} - ${updatedBooking.end_time}`,
      )

      // Create in-app notification
      await createNotification({
        user_id: updatedBooking.user_id,
        type: "check_in_success",
        title: "Check-in Successful",
        message: `You have successfully checked in at ${updatedBooking.venues.name}. Enjoy your session!`,
        data: {
          booking_id: updatedBooking.id,
          venue_name: updatedBooking.venues.name,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("Error verifying booking:", error)
    return NextResponse.json({ error: "Failed to verify booking" }, { status: 500 })
  }
}
