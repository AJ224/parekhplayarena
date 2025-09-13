"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const sports = [
  { value: "basketball", label: "Basketball" },
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "tennis", label: "Tennis" },
  { value: "badminton", label: "Badminton" },
  { value: "volleyball", label: "Volleyball" },
  { value: "swimming", label: "Swimming" },
  { value: "table-tennis", label: "Table Tennis" },
  { value: "squash", label: "Squash" },
  { value: "yoga", label: "Yoga" },
]

export function SportSelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("basketball")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? sports.find((sport) => sport.value === value)?.label : "Select sport..."}
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
                  key={sport.value}
                  value={sport.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === sport.value ? "opacity-100" : "opacity-0"}`} />
                  {sport.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
