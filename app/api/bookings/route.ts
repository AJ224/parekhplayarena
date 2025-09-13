import { type NextRequest, NextResponse } from "next/server"
import { createBooking, createAtomicBooking, updateBookingQRCode } from "@/lib/database/bookings"
import { generateBookingQRCode } from "@/utils/qr-code-generator"
import { sendBookingConfirmationWithQR } from "@/services/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["user_id", "venue_id", "court_id", "booking_date", "start_time", "end_time"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    let booking

    // Use atomic booking if available, fallback to legacy booking
    if (body.use_atomic !== false) {
      try {
        booking = await createAtomicBooking({
          court_id: body.court_id,
          booking_date: body.booking_date,
          start_time: body.start_time,
          end_time: body.end_time,
          user_id: body.user_id,
          venue_id: body.venue_id,
          game_type_id: body.game_type_id,
          total_slots: body.total_slots || 1,
        })
      } catch (atomicError) {
        console.warn("Atomic booking failed, falling back to legacy booking:", atomicError)
        // Fallback to legacy booking with total_amount
        if (!body.total_amount) {
          return NextResponse.json(
            { error: "total_amount is required for legacy booking" },
            { status: 400 }
          )
        }
        booking = await createBooking(body)
      }
    } else {
      // Legacy booking
      if (!body.total_amount) {
        return NextResponse.json(
          { error: "total_amount is required for legacy booking" },
          { status: 400 }
        )
      }
      booking = await createBooking(body)
    }

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
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
