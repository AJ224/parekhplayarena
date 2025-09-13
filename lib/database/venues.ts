import { supabase } from "@/lib/supabase"

export interface Venue {
  id: string
  name: string
  description?: string
  location_id: string
  sport_id: string
  address: string
  phone?: string
  email?: string
  rating: number
  total_reviews: number
  price_per_hour: number
  images?: string[]
  amenities?: string[]
  rules?: string[]
  opening_time: string
  closing_time: string
  is_active: boolean
  created_at: string
  updated_at: string
  locations?: {
    name: string
    pincode?: string
    cities?: {
      name: string
      state: string
    }
  }
  sports?: {
    name: string
    description?: string
  }
  courts?: Array<{
    id: string
    name: string
    type: string
    capacity: number
    is_active: boolean
  }>
}

export async function getVenues(filters?: {
  city?: string
  sport?: string
  location?: string
  priceRange?: [number, number]
  amenities?: string[]
}) {
  let query = supabase
    .from("venues")
    .select(`
      *,
      locations (
        name,
        pincode,
        cities (name, state)
      ),
      sports (name, description),
      courts (id, name, type, capacity, is_active)
    `)
    .eq("is_active", true)
    .order("rating", { ascending: false })

  // Apply filters
  if (filters?.city) {
    query = query.eq("locations.cities.name", filters.city)
  }

  if (filters?.sport) {
    query = query.eq("sports.name", filters.sport)
  }

  if (filters?.priceRange) {
    query = query
      .gte("price_per_hour", filters.priceRange[0] * 100) // Convert to paise
      .lte("price_per_hour", filters.priceRange[1] * 100)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching venues:", error)
    throw new Error("Failed to fetch venues")
  }

  return data
}

export async function getVenueById(venueId: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from("venues")
    .select(`
      *,
      locations (
        name,
        pincode,
        cities (name, state)
      ),
      sports (name, description),
      courts (id, name, type, capacity, is_active)
    `)
    .eq("id", venueId)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("Error fetching venue:", error)
    return null
  }

  return data
}

export async function getVenueAvailability(venueId: string, courtId: string, date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .eq("venue_id", venueId)
    .eq("court_id", courtId)
    .eq("booking_date", date)
    .in("status", ["confirmed", "pending"])

  if (error) {
    console.error("Error fetching venue availability:", error)
    throw new Error("Failed to fetch availability")
  }

  return data
}

export async function searchVenues(
  searchTerm: string,
  filters?: {
    city?: string
    sport?: string
  },
) {
  let query = supabase
    .from("venues")
    .select(`
      *,
      locations (
        name,
        pincode,
        cities (name, state)
      ),
      sports (name, description),
      courts (id, name, type, capacity, is_active)
    `)
    .eq("is_active", true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)

  if (filters?.city) {
    query = query.eq("locations.cities.name", filters.city)
  }

  if (filters?.sport) {
    query = query.eq("sports.name", filters.sport)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error searching venues:", error)
    throw new Error("Failed to search venues")
  }

  return data
}
