"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Sport {
  id: string
  name: string
  description?: string
  icon_url?: string
  venues: number
}

export function FeaturedSports() {
  const [sports, setSports] = useState<Sport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedSports = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/sports?limit=6")
        if (!response.ok) throw new Error("Failed to fetch sports")
        
        const data = await response.json()
        setSports(data.sports || [])
      } catch (error) {
        console.error("Error fetching featured sports:", error)
        setSports([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedSports()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden h-full">
            <Skeleton className="h-32 w-full" />
            <CardContent className="p-3 text-center space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {sports.map((sport) => (
        <Link href={`/search?sport=${sport.name}`} key={sport.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
            <div className="relative h-32">
              <Image 
                src={sport.icon_url || `/placeholder.svg?height=128&width=200`} 
                alt={sport.name} 
                fill 
                className="object-cover" 
              />
            </div>
            <CardContent className="p-3 text-center">
              <h3 className="font-medium">{sport.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{sport.venues} venues</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
