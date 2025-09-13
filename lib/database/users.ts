import { createServerClient } from "@/lib/supabase"

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export async function createUserProfile(userData: {
  id: string
  email: string
  full_name?: string
  phone?: string
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) {
    console.error("Error creating user profile:", error)
    throw new Error("Failed to create user profile")
  }

  return data
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }

  return data
}

export async function getUserNotifications(userId: string, limit = 20) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching notifications:", error)
    throw new Error("Failed to fetch notifications")
  }

  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single()

  if (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }

  return data
}

export async function createNotification(notificationData: {
  user_id: string
  type: string
  title: string
  message: string
  data?: any
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase.from("notifications").insert([notificationData]).select().single()

  if (error) {
    console.error("Error creating notification:", error)
    throw new Error("Failed to create notification")
  }

  return data
}
