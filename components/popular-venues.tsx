"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Venue {
  id: string
  name: string
  address: string
  rating: number
  total_reviews: number
  price_per_hour: number
  locations?: {
    name: string
    cities?: {
      name: string
    }
  }
  sports?: {
    name: string
  }
}

export function PopularVenues() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPopularVenues = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/venues?limit=4")
        if (!response.ok) throw new Error("Failed to fetch venues")
        
        const data = await response.json()
        setVenues(data.venues || [])
      } catch (error) {
        console.error("Error fetching popular venues:", error)
        setVenues([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopularVenues()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {venues.map((venue) => (
        <Link href={`/venue/${venue.id}`} key={venue.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <Image src={`/generic-placeholder-300px.png?height=160&width=320`} alt={venue.name} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {venue.rating.toFixed(1)}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{venue.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{venue.locations?.name}, {venue.locations?.cities?.name}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs">{venue.sports?.name}</span>
                <span className="font-medium text-green-600">₹{Math.floor(venue.price_per_hour / 100)}/hr</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
