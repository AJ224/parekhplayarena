"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface DynamicPricingDisplayProps {
  venueId: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  basePrice?: number
  showComparison?: boolean
  className?: string
}

interface PricingData {
  price: number
  price_in_rupees: number
  venue_id: string
  court_id: string
  date: string
  start_time: string
  end_time: string
}

export function DynamicPricingDisplay({
  venueId,
  courtId,
  date,
  startTime,
  endTime,
  basePrice,
  showComparison = true,
  className,
}: DynamicPricingDisplayProps) {
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `/api/pricing/calculate?venue_id=${venueId}&court_id=${courtId}&date=${date}&start_time=${startTime}&end_time=${endTime}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch pricing")
        }

        const data = await response.json()
        setPricing(data)
      } catch (err) {
        console.error("Error fetching pricing:", err)
        setError(err instanceof Error ? err.message : "Failed to load pricing")
      } finally {
        setIsLoading(false)
      }
    }

    if (venueId && courtId && date && startTime && endTime) {
      fetchPricing()
    }
  }, [venueId, courtId, date, startTime, endTime])

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getPriceTrend = () => {
    if (!pricing || !basePrice) return null
    
    const currentPrice = pricing.price_in_rupees
    const basePriceRupees = Math.floor(basePrice / 100)
    
    if (currentPrice > basePriceRupees) {
      return { trend: "up", percentage: Math.round(((currentPrice - basePriceRupees) / basePriceRupees) * 100) }
    } else if (currentPrice < basePriceRupees) {
      return { trend: "down", percentage: Math.round(((basePriceRupees - currentPrice) / basePriceRupees) * 100) }
    }
    return null
  }

  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(":")[0])
    if (hour >= 6 && hour < 12) return "Morning"
    if (hour >= 12 && hour < 17) return "Afternoon"
    if (hour >= 17 && hour < 22) return "Evening"
    return "Night"
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !pricing) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {error || "Unable to load pricing"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const priceTrend = getPriceTrend()
  const timeOfDay = getTimeOfDay(startTime)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Dynamic Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            ₹{pricing.price_in_rupees}
          </div>
          <div className="text-sm text-muted-foreground">
            per hour
          </div>
        </div>

        {/* Price Trend */}
        {priceTrend && showComparison && (
          <div className="flex items-center justify-center gap-2">
            {priceTrend.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
            <Badge
              variant={priceTrend.trend === "up" ? "destructive" : "default"}
              className="text-xs"
            >
              {priceTrend.trend === "up" ? "+" : "-"}{priceTrend.percentage}% from base
            </Badge>
          </div>
        )}

        {/* Time Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Time:
            </span>
            <span className="font-medium">
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Period:</span>
            <Badge variant="outline" className="text-xs">
              {timeOfDay}
            </Badge>
          </div>
        </div>

        {/* Base Price Comparison */}
        {basePrice && showComparison && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Base price:</span>
              <span>₹{Math.floor(basePrice / 100)}</span>
            </div>
          </div>
        )}

        {/* Pricing Note */}
        <div className="text-xs text-muted-foreground text-center">
          Prices may vary based on demand and time of day
        </div>
      </CardContent>
    </Card>
  )
}
