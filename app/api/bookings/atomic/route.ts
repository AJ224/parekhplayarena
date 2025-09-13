import { type NextRequest, NextResponse } from "next/server"
import { createAtomicBooking, updateBookingQRCode } from "@/lib/database/bookings"
import { generateBookingQRCode } from "@/utils/qr-code-generator"
import { sendBookingConfirmationWithQR } from "@/services/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["court_id", "booking_date", "start_time", "end_time", "user_id", "venue_id"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create atomic booking
    const booking = await createAtomicBooking(body)

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
    console.error("Error creating atomic booking:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
