import { supabase } from "@/lib/supabase"

export interface Booking {
  id: string
  booking_reference: string
  user_id: string
  venue_id: string
  court_id: string
  game_type_id?: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  service_fee: number
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  check_in_status: "not_checked_in" | "checked_in"
  check_in_time?: string
  qr_code_url?: string
  cancellation_reason?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
  venues?: {
    name: string
    address: string
    phone?: string
  }
  courts?: {
    name: string
    type: string
  }
  users?: {
    full_name?: string
    email: string
    phone?: string
  }
}

export async function createBooking(bookingData: {
  user_id: string
  venue_id: string
  court_id: string
  game_type_id?: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  service_fee?: number
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        ...bookingData,
        service_fee: bookingData.service_fee || 5000, // Default ₹50 service fee
        status: "pending",
        payment_status: "pending",
        check_in_status: "not_checked_in",
      },
    ])
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type),
      users (full_name, email, phone)
    `)
    .single()

  if (error) {
    console.error("Error creating booking:", error)
    throw new Error("Failed to create booking")
  }

  return data
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type),
      users (full_name, email, phone)
    `)
    .eq("id", bookingId)
    .single()

  if (error) {
    console.error("Error fetching booking:", error)
    return null
  }

  return data
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type),
      users (full_name, email, phone)
    `)
    .eq("booking_reference", reference)
    .single()

  if (error) {
    console.error("Error fetching booking by reference:", error)
    return null
  }

  return data
}

export async function getUserBookings(userId: string, status?: string) {
  let query = supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching user bookings:", error)
    throw new Error("Failed to fetch bookings")
  }

  return data
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"],
  additionalData?: Partial<Booking>,
) {
  const updateData: any = { status, ...additionalData }

  const { data, error } = await supabase.from("bookings").update(updateData).eq("id", bookingId).select().single()

  if (error) {
    console.error("Error updating booking status:", error)
    throw new Error("Failed to update booking status")
  }

  return data
}

export async function updateBookingCheckIn(bookingId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      check_in_status: "checked_in",
      check_in_time: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type),
      users (full_name, email, phone)
    `)
    .single()

  if (error) {
    console.error("Error updating check-in status:", error)
    throw new Error("Failed to update check-in status")
  }

  return data
}

export async function updateBookingQRCode(bookingId: string, qrCodeUrl: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ qr_code_url: qrCodeUrl })
    .eq("id", bookingId)
    .select()
    .single()

  if (error) {
    console.error("Error updating QR code:", error)
    throw new Error("Failed to update QR code")
  }

  return data
}
