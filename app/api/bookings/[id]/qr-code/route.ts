import { type NextRequest, NextResponse } from "next/server"
import { generateBookingQRCode } from "@/utils/qr-code-generator"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id

    // In a real application, you would verify that the booking exists
    // and that the user has permission to access it

    // Generate QR code
    const qrCodeUrl = await generateBookingQRCode(bookingId)

    return NextResponse.json({ qrCodeUrl })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
