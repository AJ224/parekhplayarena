import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

export function FeaturedSports() {
  const sports = [
    {
      id: "basketball",
      name: "Basketball",
      venues: 42,
    },
    {
      id: "cricket",
      name: "Cricket",
      venues: 38,
    },
    {
      id: "football",
      name: "Football",
      venues: 56,
    },
    {
      id: "tennis",
      name: "Tennis",
      venues: 29,
    },
    {
      id: "badminton",
      name: "Badminton",
      venues: 45,
    },
    {
      id: "swimming",
      name: "Swimming",
      venues: 18,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {sports.map((sport) => (
        <Link href={`/search?sport=${sport.id}`} key={sport.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
            <div className="relative h-32">
              <Image src={`/placeholder.svg?height=128&width=200`} alt={sport.name} fill className="object-cover" />
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
