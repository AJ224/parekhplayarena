import { createServerClient } from "@/lib/supabase"

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
  total_slots: number // Number of continuous slots booked
  total_amount: number
  service_fee: number
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  check_in_status: "not_checked_in" | "checked_in"
  check_in_time?: string
  qr_code_url?: string
  cancellation_reason?: string
  cancelled_at?: string
  version: number // For optimistic locking
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
    supported_sports?: string[]
  }
  users?: {
    full_name?: string
    email: string
    phone?: string
  }
  booking_slots?: BookingSlot[]
}

export interface BookingSlot {
  id: string
  booking_id: string
  slot_availability_id: string
  slot_sequence: number
  created_at: string
  slot_availability?: SlotAvailability
}

export interface SlotAvailability {
  id: string
  court_id: string
  date: string
  time_slot_id: string
  is_available: boolean
  booking_id?: string
  blocked_reason?: string
  version: number // For optimistic locking
  created_at: string
  updated_at: string
  time_slots?: TimeSlot
}

export interface TimeSlot {
  id: string
  venue_id: string
  court_id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_duration_minutes: number
  price_per_slot: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SlotReservation {
  id: string
  court_id: string
  date: string
  start_time: string
  end_time: string
  user_id: string
  expires_at: string
  status: "reserved" | "confirmed" | "expired"
  created_at: string
}

export interface PricingRule {
  id: string
  venue_id: string
  court_id?: string
  rule_type: "base_price" | "multiplier" | "fixed_override"
  day_of_week?: number
  start_time?: string
  end_time?: string
  price_value: number
  valid_from: string
  valid_to: string
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  entity_type?: string
  entity_id?: string
  metadata?: Record<string, any>
  created_at: string
}

export async function createBooking(bookingData: {
  user_id: string
  venue_id: string
  court_id: string
  game_type_id?: string
  booking_date: string
  start_time: string
  end_time: string
  total_slots: number
  total_amount: number
  service_fee?: number
}) {
  const supabase = createServerClient()
  
  // Generate booking reference
  const { data: refData, error: refError } = await supabase
    .rpc('generate_booking_reference')
  
  if (refError) {
    console.error("Error generating booking reference:", refError)
    throw new Error("Failed to generate booking reference")
  }
  
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        ...bookingData,
        booking_reference: refData,
        service_fee: bookingData.service_fee || 5000, // Default ₹50 service fee
        status: "pending",
        payment_status: "pending",
        check_in_status: "not_checked_in",
      },
    ])
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type, supported_sports),
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
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type, supported_sports),
      users (full_name, email, phone),
      booking_slots (
        id,
        slot_sequence,
        slot_availability (
          id,
          date,
          is_available,
          time_slots (
            id,
            start_time,
            end_time,
            slot_duration_minutes,
            price_per_slot
          )
        )
      )
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
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type, supported_sports),
      users (full_name, email, phone),
      booking_slots (
        id,
        slot_sequence,
        slot_availability (
          id,
          date,
          is_available,
          time_slots (
            id,
            start_time,
            end_time,
            slot_duration_minutes,
            price_per_slot
          )
        )
      )
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
  const supabase = createServerClient()
  
  let query = supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type, supported_sports)
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
  const supabase = createServerClient()
  const updateData: any = { status, ...additionalData }

  const { data, error } = await supabase.from("bookings").update(updateData).eq("id", bookingId).select().single()

  if (error) {
    console.error("Error updating booking status:", error)
    throw new Error("Failed to update booking status")
  }

  return data
}

export async function updateBookingCheckIn(bookingId: string) {
  const supabase = createServerClient()
  
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
  const supabase = createServerClient()
  
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

// New atomic booking function using the database function
export async function createAtomicBooking(bookingData: {
  court_id: string
  booking_date: string
  start_time: string
  end_time: string
  user_id: string
  venue_id: string
  game_type_id?: string
  total_slots?: number
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .rpc('book_slots_atomic', {
      p_court_id: bookingData.court_id,
      p_date: bookingData.booking_date,
      p_start_time: bookingData.start_time,
      p_end_time: bookingData.end_time,
      p_user_id: bookingData.user_id,
      p_venue_id: bookingData.venue_id,
      p_game_type_id: bookingData.game_type_id || null,
      p_total_slots: bookingData.total_slots || 1
    })

  if (error) {
    console.error("Error creating atomic booking:", error)
    throw new Error(error.message || "Failed to create booking")
  }

  // Fetch the created booking with all related data
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select(`
      *,
      venues (name, address, phone),
      courts (name, type, supported_sports),
      users (full_name, email, phone),
      booking_slots (
        id,
        slot_sequence,
        slot_availability (
          id,
          date,
          is_available,
          time_slots (
            id,
            start_time,
            end_time,
            slot_duration_minutes,
            price_per_slot
          )
        )
      )
    `)
    .eq("id", data)
    .single()

  if (fetchError) {
    console.error("Error fetching created booking:", fetchError)
    throw new Error("Failed to fetch created booking")
  }

  return booking
}

// Slot reservation functions
export async function reserveSlot(reservationData: {
  court_id: string
  date: string
  start_time: string
  end_time: string
  user_id: string
  reservation_minutes?: number
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .rpc('reserve_slot', {
      p_court_id: reservationData.court_id,
      p_date: reservationData.date,
      p_start_time: reservationData.start_time,
      p_end_time: reservationData.end_time,
      p_user_id: reservationData.user_id,
      p_reservation_minutes: reservationData.reservation_minutes || 15
    })

  if (error) {
    console.error("Error reserving slot:", error)
    throw new Error(error.message || "Failed to reserve slot")
  }

  return data
}

export async function getSlotReservations(userId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("slot_reservations")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "reserved")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching slot reservations:", error)
    throw new Error("Failed to fetch slot reservations")
  }

  return data
}

// Dynamic pricing functions
export async function calculateSlotPrice(priceData: {
  venue_id: string
  court_id: string
  date: string
  start_time: string
  end_time: string
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .rpc('calculate_slot_price', {
      p_venue_id: priceData.venue_id,
      p_court_id: priceData.court_id,
      p_date: priceData.date,
      p_start_time: priceData.start_time,
      p_end_time: priceData.end_time
    })

  if (error) {
    console.error("Error calculating slot price:", error)
    throw new Error("Failed to calculate slot price")
  }

  return data
}

// Slot availability functions
export async function getSlotAvailability(courtId: string, date: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("slot_availability")
    .select(`
      *,
      time_slots (
        id,
        start_time,
        end_time,
        slot_duration_minutes,
        price_per_slot
      )
    `)
    .eq("court_id", courtId)
    .eq("date", date)
    .order("time_slots(start_time)")

  if (error) {
    console.error("Error fetching slot availability:", error)
    throw new Error("Failed to fetch slot availability")
  }

  return data
}

// User activity tracking
export async function trackUserActivity(activityData: {
  user_id: string
  activity_type: string
  entity_type?: string
  entity_id?: string
  metadata?: Record<string, any>
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("user_activity_logs")
    .insert([activityData])
    .select()
    .single()

  if (error) {
    console.error("Error tracking user activity:", error)
    // Don't throw error for activity tracking failures
    return null
  }

  return data
}

// Get user activity logs
export async function getUserActivity(userId: string, limit: number = 50) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("user_activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching user activity:", error)
    throw new Error("Failed to fetch user activity")
  }

  return data
}
