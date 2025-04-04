import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function PopularVenues() {
  const venues = [
    {
      id: 1,
      name: "Hoops Arena",
      location: "Andheri West, Mumbai",
      rating: 4.8,
      sport: "Basketball",
      price: "₹500/hr",
    },
    {
      id: 2,
      name: "Green Field",
      location: "Powai, Mumbai",
      rating: 4.6,
      sport: "Football",
      price: "₹800/hr",
    },
    {
      id: 3,
      name: "Smash Court",
      location: "Bandra, Mumbai",
      rating: 4.7,
      sport: "Badminton",
      price: "₹400/hr",
    },
    {
      id: 4,
      name: "Cricket Hub",
      location: "Dadar, Mumbai",
      rating: 4.5,
      sport: "Cricket",
      price: "₹1200/hr",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {venues.map((venue) => (
        <Link href={`/venue/${venue.id}`} key={venue.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <Image src={`/football.jpg?height=160&width=320`} alt={venue.name} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {venue.rating}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{venue.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{venue.location}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs">{venue.sport}</span>
                <span className="font-medium text-green-600">{venue.price}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

