"use client"

import { useCallback } from "react"

interface ActivityData {
  user_id: string
  activity_type: string
  entity_type?: string
  entity_id?: string
  metadata?: Record<string, any>
}

export function useUserActivity() {
  const trackActivity = useCallback(async (activityData: ActivityData) => {
    try {
      await fetch("/api/analytics/track-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      })
    } catch (error) {
      console.error("Failed to track user activity:", error)
      // Don't throw error for activity tracking failures
    }
  }, [])

  const trackPageView = useCallback(
    (userId: string, page: string, metadata?: Record<string, any>) => {
      trackActivity({
        user_id: userId,
        activity_type: "page_view",
        entity_type: "page",
        entity_id: page,
        metadata,
      })
    },
    [trackActivity]
  )

  const trackVenueView = useCallback(
    (userId: string, venueId: string, metadata?: Record<string, any>) => {
      trackActivity({
        user_id: userId,
        activity_type: "venue_view",
        entity_type: "venue",
        entity_id: venueId,
        metadata,
      })
    },
    [trackActivity]
  )

  const trackSearch = useCallback(
    (userId: string, searchQuery: string, filters?: Record<string, any>) => {
      trackActivity({
        user_id: userId,
        activity_type: "search",
        entity_type: "search",
        metadata: {
          query: searchQuery,
          filters,
        },
      })
    },
    [trackActivity]
  )

  const trackSlotSelection = useCallback(
    (userId: string, courtId: string, date: string, timeSlot: string) => {
      trackActivity({
        user_id: userId,
        activity_type: "slot_selection",
        entity_type: "slot",
        entity_id: courtId,
        metadata: {
          date,
          time_slot: timeSlot,
        },
      })
    },
    [trackActivity]
  )

  const trackBookingAttempt = useCallback(
    (userId: string, venueId: string, courtId: string, metadata?: Record<string, any>) => {
      trackActivity({
        user_id: userId,
        activity_type: "booking_attempt",
        entity_type: "booking",
        entity_id: venueId,
        metadata: {
          court_id: courtId,
          ...metadata,
        },
      })
    },
    [trackActivity]
  )

  const trackBookingSuccess = useCallback(
    (userId: string, bookingId: string, metadata?: Record<string, any>) => {
      trackActivity({
        user_id: userId,
        activity_type: "booking_success",
        entity_type: "booking",
        entity_id: bookingId,
        metadata,
      })
    },
    [trackActivity]
  )

  return {
    trackActivity,
    trackPageView,
    trackVenueView,
    trackSearch,
    trackSlotSelection,
    trackBookingAttempt,
    trackBookingSuccess,
  }
}
