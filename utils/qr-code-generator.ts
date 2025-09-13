import QRCode from "qrcode"

export async function generateQRCode(bookingId: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://sportsspot.com"}/verify-booking/${bookingId}`,
      {
        width: 300,
        margin: 2,
        color: {
          dark: "#16a34a", // Green color for QR code
          light: "#FFFFFF", // White background
        },
      },
    )

    return qrCodeDataUrl
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

export async function generateBookingQRCode(bookingId: string): Promise<string> {
  return generateQRCode(bookingId)
}
