"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Stats {
  totalVenues: number
  totalSports: number
  totalCities: number
}

export function HeroSection() {
  const [stats, setStats] = useState<Stats>({ totalVenues: 0, totalSports: 0, totalCities: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all stats in parallel
        const [venuesResponse, sportsResponse, citiesResponse] = await Promise.all([
          fetch("/api/venues"),
          fetch("/api/sports"),
          fetch("/api/cities")
        ])

        const [venuesData, sportsData, citiesData] = await Promise.all([
          venuesResponse.json(),
          sportsResponse.json(),
          citiesResponse.json()
        ])

        setStats({
          totalVenues: venuesData.count || 0,
          totalSports: sportsData.count || 0,
          totalCities: citiesData.count || 0
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set fallback values
        setStats({ totalVenues: 1000, totalSports: 15, totalCities: 50 })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <Image
        src="https://img.freepik.com/free-photo/sports-center_1127-4159.jpg?t=st=1743778373~exp=1743781973~hmac=b0e3eb8b371950cfffe29b701be5efcde78582137eb221d29a6e50d68c5e39d2&w=996"
        alt="Sports arena"
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">Book Sports Venues Across India</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Find and book courts for basketball, cricket, football, tennis, badminton and more
        </p>
        
        {/* Dynamic Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              {isLoading ? "..." : stats.totalVenues.toLocaleString()}+
            </div>
            <div className="text-sm text-gray-300">Venues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              {isLoading ? "..." : stats.totalSports}+
            </div>
            <div className="text-sm text-gray-300">Sports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              {isLoading ? "..." : stats.totalCities}+
            </div>
            <div className="text-sm text-gray-300">Cities</div>
          </div>
        </div>
      </div>
    </div>
  )
}
