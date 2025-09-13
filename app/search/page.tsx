"use client"

import { useState, useEffect } from "react"
import { Filter, MapPin, Calendar, Clock, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { CitySelector } from "@/components/city-selector"
import { DatePicker } from "@/components/date-picker"
import { SportSelector } from "@/components/sport-selector"
import { Skeleton } from "@/components/ui/skeleton"

interface Venue {
  id: string
  name: string
  address: string
  rating: number
  total_reviews: number
  price_per_hour: number
  amenities: string[]
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

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: "",
    sport: "",
    priceRange: [0, 2000],
    amenities: [] as string[],
    timeSlot: "any",
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (searchParams.get("city")) params.set("city", searchParams.get("city")!)
        if (searchParams.get("sport")) params.set("sport", searchParams.get("sport")!)

        const response = await fetch(`/api/venues?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch venues")

        const data = await response.json()
        setVenues(data.venues || [])
      } catch (error) {
        console.error("Error fetching venues:", error)
        setVenues([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVenues()
  }, [searchParams])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredVenues = venues.filter((venue) => {
    // Apply client-side filters
    const priceInRupees = venue.price_per_hour / 100
    if (priceInRupees < filters.priceRange[0] || priceInRupees > filters.priceRange[1]) {
      return false
    }

    if (filters.amenities.length > 0) {
      const hasRequiredAmenities = filters.amenities.every((amenity) => venue.amenities?.includes(amenity))
      if (!hasRequiredAmenities) return false
    }

    return true
  })

  if (isLoading) {
    return (
      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64">
            <Skeleton className="h-8 w-24 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="md:w-1/3 h-48 md:h-auto" />
                  <div className="flex-1 p-6 space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-6">
          <div className="flex items-center justify-between md:justify-start">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"}
            </Button>
          </div>

          <div className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="space-y-4">
              <h3 className="font-medium">Location</h3>
              <CitySelector />
              <Input placeholder="Search by area, locality" />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Sport</h3>
              <SportSelector />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Date & Time</h3>
              <DatePicker />
              <div className="space-y-2">
                <h4 className="text-sm">Time Slot</h4>
                <RadioGroup value={filters.timeSlot} onValueChange={(value) => handleFilterChange("timeSlot", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morning" id="morning" />
                    <Label htmlFor="morning">Morning (6AM - 12PM)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afternoon" id="afternoon" />
                    <Label htmlFor="afternoon">Afternoon (12PM - 5PM)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evening" id="evening" />
                    <Label htmlFor="evening">Evening (5PM - 10PM)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Price Range</h3>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange("priceRange", value)}
                max={2000}
                step={100}
              />
              <div className="flex justify-between text-sm">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}+</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Amenities</h3>
              <div className="space-y-2">
                {["Parking", "Changing Rooms", "Shower", "Equipment Rental", "Café"].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange("amenities", [...filters.amenities, amenity])
                        } else {
                          handleFilterChange(
                            "amenities",
                            filters.amenities.filter((a) => a !== amenity),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {searchParams.get("sport") ? `${searchParams.get("sport")} Courts` : "Sports Venues"}
              {searchParams.get("city") && ` in ${searchParams.get("city")}`}
            </h1>
            <div className="text-sm text-muted-foreground">{filteredVenues.length} results</div>
          </div>

          <div className="space-y-4">
            {filteredVenues.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No venues found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <Card key={venue.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <Image
                        src={`/generic-placeholder-300px.png?height=300&width=400`}
                        alt="Sports venue"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold">{venue.name}</h3>
                            <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-sm">
                              <Star className="h-4 w-4 mr-1 fill-green-500 text-green-500" />
                              {venue.rating.toFixed(1)}
                            </div>
                          </div>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {venue.locations?.name}, {venue.locations?.cities?.name}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-green-600" />
                              Available today
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-green-600" />
                              6:00 AM - 10:00 PM
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {venue.amenities?.slice(0, 3).map((amenity) => (
                              <span key={amenity} className="bg-slate-100 px-2 py-1 rounded-full text-xs">
                                {amenity}
                              </span>
                            ))}
                            {venue.amenities && venue.amenities.length > 3 && (
                              <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">
                                +{venue.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div>
                            <div className="text-sm text-muted-foreground">Starting from</div>
                            <div className="text-xl font-bold text-green-600">
                              ₹{Math.floor(venue.price_per_hour / 100)}/hr
                            </div>
                          </div>
                          <Button asChild>
                            <Link href={`/venue/${venue.id}`}>Book Now</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
