import { type NextRequest, NextResponse } from "next/server"
import { createBooking, updateBookingQRCode } from "@/lib/database/bookings"
import { generateBookingQRCode } from "@/utils/qr-code-generator"
import { sendBookingConfirmationWithQR } from "@/services/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["user_id", "venue_id", "court_id", "booking_date", "start_time", "end_time", "total_amount"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create booking
    const booking = await createBooking(body)

    // Generate QR code
    const qrCodeUrl = await generateBookingQRCode(booking.id)

    // Update booking with QR code URL
    await updateBookingQRCode(booking.id, qrCodeUrl)

    // Send confirmation notifications
    if (booking.users?.email && booking.venues?.name) {
      await sendBookingConfirmationWithQR(
        booking.booking_reference,
        booking.users.email,
        booking.users.phone || "",
        booking.venues.name,
        booking.booking_date,
        `${booking.start_time} - ${booking.end_time}`,
        qrCodeUrl,
      )
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        qr_code_url: qrCodeUrl,
      },
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
