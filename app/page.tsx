import Link from "next/link"
import { ArrowRight, Calendar, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PopularVenues } from "@/components/popular-venues"
import { FeaturedSports } from "@/components/featured-sports"
import { HeroSection } from "@/components/hero-section"
import { CitySelector } from "@/components/city-selector"
import { DatePicker } from "@/components/date-picker"
import { SportSelector } from "@/components/sport-selector"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <div className="container px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto -mt-16 relative z-10 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="book" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="book">Book a Court</TabsTrigger>
                <TabsTrigger value="manage">Manage Booking</TabsTrigger>
              </TabsList>
              <TabsContent value="book" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <CitySelector />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sport</label>
                    <SportSelector />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <DatePicker />
                  </div>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/search">
                    Search Courts <Search className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TabsContent>
              <TabsContent value="manage" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Booking Reference</label>
                  <Input placeholder="Enter your booking reference" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input placeholder="Enter your email" type="email" />
                </div>
                <Button className="w-full" size="lg">
                  Find Booking
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-16 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Popular Venues</h2>
              <Link
                href="/venues"
                className="text-sm font-medium flex items-center text-green-600 hover:text-green-700"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <PopularVenues />
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Sports</h2>
              <Link
                href="/sports"
                className="text-sm font-medium flex items-center text-green-600 hover:text-green-700"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <FeaturedSports />
          </section>

          <section className="bg-slate-50 -mx-4 px-4 py-12 rounded-lg">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-bold">Why Choose SportsSpot?</h2>
              <p className="text-slate-600">
                Book sports facilities across multiple cities with ease. Find and reserve courts for your favorite games
                in just a few clicks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Multiple Locations</h3>
                  <p className="text-sm text-slate-500">Access to venues across 50+ cities</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Instant Booking</h3>
                  <p className="text-sm text-slate-500">Secure your spot in seconds</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Wide Selection</h3>
                  <p className="text-sm text-slate-500">15+ sports and 1000+ venues</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
