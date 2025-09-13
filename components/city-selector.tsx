"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface City {
  id: string
  name: string
  state: string
  country: string
  locations: number
}

export function CitySelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cities")
        if (!response.ok) throw new Error("Failed to fetch cities")
        
        const data = await response.json()
        setCities(data.cities || [])
        
        // Set default value to first city if available
        if (data.cities && data.cities.length > 0) {
          setValue(data.cities[0].name.toLowerCase())
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
        setCities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" disabled={isLoading}>
          {isLoading ? "Loading cities..." : value ? cities.find((city) => city.name.toLowerCase() === value)?.name : "Select city..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue.toLowerCase())
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === city.name.toLowerCase() ? "opacity-100" : "opacity-0"}`} />
                  <div className="flex flex-col">
                    <span>{city.name}</span>
                    <span className="text-xs text-muted-foreground">{city.state}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
