"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Sport {
  id: string
  name: string
  description?: string
  icon_url?: string
  venues: number
}

export function SportSelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [sports, setSports] = useState<Sport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/sports")
        if (!response.ok) throw new Error("Failed to fetch sports")
        
        const data = await response.json()
        setSports(data.sports || [])
        
        // Set default value to first sport if available
        if (data.sports && data.sports.length > 0) {
          setValue(data.sports[0].name.toLowerCase())
        }
      } catch (error) {
        console.error("Error fetching sports:", error)
        setSports([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSports()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" disabled={isLoading}>
          {isLoading ? "Loading sports..." : value ? sports.find((sport) => sport.name.toLowerCase() === value)?.name : "Select sport..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search sport..." />
          <CommandList>
            <CommandEmpty>No sport found.</CommandEmpty>
            <CommandGroup>
              {sports.map((sport) => (
                <CommandItem
                  key={sport.id}
                  value={sport.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue.toLowerCase())
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === sport.name.toLowerCase() ? "opacity-100" : "opacity-0"}`} />
                  <div className="flex flex-col">
                    <span>{sport.name}</span>
                    <span className="text-xs text-muted-foreground">{sport.venues} venues</span>
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
