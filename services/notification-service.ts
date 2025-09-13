// Types for notifications
export interface NotificationOptions {
  type: "email" | "sms" | "push"
  recipient: string
  subject?: string
  message: string
  data?: Record<string, any>
}

// Mock notification service
export const sendNotification = async (options: NotificationOptions): Promise<boolean> => {
  try {
    console.log(`Sending ${options.type} notification to ${options.recipient}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Message: ${options.message}`)

    // In a real app, you would integrate with an email service, SMS gateway, or push notification service

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return true
  } catch (error) {
    console.error(`Error sending ${options.type} notification:`, error)
    return false
  }
}

// Specific notification functions
export const sendCheckInNotification = async (
  bookingId: string,
  userEmail: string,
  userPhone: string,
  venueName: string,
  date: string,
  time: string,
): Promise<void> => {
  // Send email notification
  await sendNotification({
    type: "email",
    recipient: userEmail,
    subject: "Check-in Confirmed",
    message: `You have successfully checked in at ${venueName} on ${date} at ${time.split(" - ")[0]}. Enjoy your session!`,
    data: { bookingId, venueName, date, time },
  })

  // Send SMS notification
  await sendNotification({
    type: "sms",
    recipient: userPhone,
    message: `You have successfully checked in at ${venueName}. Enjoy your session!`,
    data: { bookingId },
  })
}

export const sendBookingConfirmationWithQR = async (
  bookingId: string,
  userEmail: string,
  userPhone: string,
  venueName: string,
  date: string,
  time: string,
  qrCodeUrl: string,
): Promise<void> => {
  // Send email notification with QR code
  await sendNotification({
    type: "email",
    recipient: userEmail,
    subject: "Booking Confirmation",
    message: `Your booking at ${venueName} on ${date} at ${time} has been confirmed. Booking ID: ${bookingId}. Please show the attached QR code at the venue for check-in.`,
    data: { bookingId, venueName, date, time, qrCodeUrl },
  })

  // Send SMS notification with link to QR code
  await sendNotification({
    type: "sms",
    recipient: userPhone,
    message: `Your booking at ${venueName} is confirmed. View your QR code: ${process.env.NEXT_PUBLIC_APP_URL || "https://sportsspot.com"}/profile/bookings/${bookingId}`,
    data: { bookingId },
  })
}
