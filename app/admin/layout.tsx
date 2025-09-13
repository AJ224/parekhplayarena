"use client"

import type React from "react"
import { useEffect, useState } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from '@/lib/supabase'
import {
  CalendarDays,
  CreditCard,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Settings,
  Trophy,
  Users,
  QrCode,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Add a small delay to ensure session is established
    setTimeout(() => {
      checkAuth()
    }, 100)
  }, [])

   const checkAuth = async () => {
     try {
       const { data: { session } } = await supabase.auth.getSession()
       
       console.log('Session:', session)
       
       if (!session) {
         console.log('No session found, redirecting to login')
         router.push('/login?redirectTo=' + encodeURIComponent(pathname))
         return
       }

       console.log('User ID:', session.user.id)

       // Check if user is an admin using API
       const adminCheckResponse = await fetch('/api/auth/check-admin', {
         headers: {
           'Authorization': `Bearer ${session.access_token}`
         }
       })

       if (!adminCheckResponse.ok) {
         console.log('Admin check failed, redirecting to home')
         router.push('/?error=unauthorized')
         return
       }

       const adminData = await adminCheckResponse.json()
       console.log('Admin check successful:', adminData)
       setIsAuthenticated(true)
     } catch (error) {
       console.error('Auth check failed:', error)
       router.push('/login?redirectTo=' + encodeURIComponent(pathname))
     } finally {
       setIsLoading(false)
     }
   }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const routes = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Cities & Locations",
      href: "/admin/locations",
      icon: MapPin,
    },
    {
      title: "Sports & Venues",
      href: "/admin/venues",
      icon: Trophy,
    },
    {
      title: "Game Types & Rules",
      href: "/admin/game-types",
      icon: Settings,
    },
    {
      title: "Bookings",
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      title: "Verification",
      href: "/admin/verification",
      icon: QrCode,
    },
    {
      title: "Payments & Coupons",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Mail,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                <Globe className="h-6 w-6 text-green-600" />
                <span>SportsSpot Admin</span>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    pathname === route.href
                      ? "bg-green-100 text-green-900 font-medium"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <route.icon className="h-5 w-5" />
                  {route.title}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/">
                  <Globe className="mr-2 h-4 w-4" />
                  Back to Site
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="p-6 border-b">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
              <Globe className="h-6 w-6 text-green-600" />
              <span>SportsSpot Admin</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === route.href
                    ? "bg-green-100 text-green-900 font-medium"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <route.icon className="h-5 w-5" />
                {route.title}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/">
                <Globe className="mr-2 h-4 w-4" />
                Back to Site
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
