"use client"

import { useState } from "react"
import { Filter, MapPin, Calendar, Clock, Star } from "lucide-react"
import Image from "next/image"

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

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)

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
                <RadioGroup defaultValue="any">
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
              <Slider defaultValue={[500]} max={2000} step={100} />
              <div className="flex justify-between text-sm">
                <span>₹0</span>
                <span>₹2000+</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Amenities</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="changing" />
                  <Label htmlFor="changing">Changing Rooms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="shower" />
                  <Label htmlFor="shower">Shower</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="equipment" />
                  <Label htmlFor="equipment">Equipment Rental</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cafe" />
                  <Label htmlFor="cafe">Café</Label>
                </div>
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Basketball Courts in Mumbai</h1>
            <div className="text-sm text-muted-foreground">24 results</div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=400`}
                      alt="Sports venue"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold">Hoops Arena {item}</h3>
                          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-sm">
                            <Star className="h-4 w-4 mr-1 fill-green-500 text-green-500" />
                            4.{item}
                          </div>
                        </div>
                        <div className="flex items-center text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">Andheri West, Mumbai</span>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                            Available today
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                            10:00 AM - 10:00 PM
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">Indoor</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">Wooden Court</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">Parking</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                          <div className="text-sm text-muted-foreground">Starting from</div>
                          <div className="text-xl font-bold text-green-600">₹{400 + item * 50}/hr</div>
                        </div>
                        <Button>Book Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

