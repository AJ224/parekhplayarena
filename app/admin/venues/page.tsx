"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function VenuesPage() {
  const [sports, setSports] = useState([
    { id: 1, name: "Basketball", venues: 42, active: true },
    { id: 2, name: "Cricket", venues: 38, active: true },
    { id: 3, name: "Football", venues: 56, active: true },
    { id: 4, name: "Tennis", venues: 29, active: true },
    { id: 5, name: "Badminton", venues: 45, active: true },
    { id: 6, name: "Volleyball", venues: 22, active: true },
    { id: 7, name: "Swimming", venues: 18, active: true },
    { id: 8, name: "Table Tennis", venues: 24, active: true },
  ])

  const [venues, setVenues] = useState([
    {
      id: 1,
      name: "Hoops Arena",
      location: "Andheri West, Mumbai",
      sport: "Basketball",
      courts: 3,
      rating: 4.8,
      active: true,
    },
    {
      id: 2,
      name: "Green Field",
      location: "Powai, Mumbai",
      sport: "Football",
      courts: 2,
      rating: 4.6,
      active: true,
    },
    {
      id: 3,
      name: "Smash Court",
      location: "Bandra, Mumbai",
      sport: "Badminton",
      courts: 6,
      rating: 4.7,
      active: true,
    },
    {
      id: 4,
      name: "Cricket Hub",
      location: "Dadar, Mumbai",
      sport: "Cricket",
      courts: 2,
      rating: 4.5,
      active: true,
    },
    {
      id: 5,
      name: "Tennis Paradise",
      location: "Juhu, Mumbai",
      sport: "Tennis",
      courts: 4,
      rating: 4.4,
      active: true,
    },
    {
      id: 6,
      name: "Aqua Center",
      location: "Powai, Mumbai",
      sport: "Swimming",
      courts: 1,
      rating: 4.3,
      active: false,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sport & Venue Management</h1>
      </div>

      <Tabs defaultValue="sports">
        <TabsList>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>

        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sports</CardTitle>
                <CardDescription>Manage sports available on SportsSpot</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sport
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sport</DialogTitle>
                    <DialogDescription>Add a new sport to the platform</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="sport-name">Sport Name</Label>
                      <Input id="sport-name" placeholder="Enter sport name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport-description">Description</Label>
                      <Textarea id="sport-description" placeholder="Enter sport description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport-icon">Icon</Label>
                      <Input id="sport-icon" type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Sport</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sport Name</TableHead>
                    <TableHead>Venues</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sports.map((sport) => (
                    <TableRow key={sport.id}>
                      <TableCell className="font-medium">{sport.name}</TableCell>
                      <TableCell>{sport.venues}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            sport.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {sport.active ? "Active" : "Inactive"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trophy className="mr-2 h-4 w-4" />
                              View Venues
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Venues</CardTitle>
                <CardDescription>Manage sports venues across all locations</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Venue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Venue</DialogTitle>
                    <DialogDescription>Add a new sports venue to the platform</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue-name">Venue Name</Label>
                      <Input id="venue-name" placeholder="Enter venue name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue-sport">Sport</Label>
                      <select
                        id="venue-sport"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a sport</option>
                        {sports.map((sport) => (
                          <option key={sport.id} value={sport.name}>
                            {sport.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue-city">City</Label>
                      <select
                        id="venue-city"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a city</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue-location">Location</Label>
                      <select
                        id="venue-location"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a location</option>
                        <option value="Andheri West">Andheri West</option>
                        <option value="Bandra">Bandra</option>
                        <option value="Powai">Powai</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue-courts">Number of Courts</Label>
                      <Input id="venue-courts" type="number" min="1" placeholder="Enter number of courts" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue-price">Price per Hour (₹)</Label>
                      <Input id="venue-price" type="number" min="0" placeholder="Enter price per hour" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="venue-address">Full Address</Label>
                      <Textarea id="venue-address" placeholder="Enter full address" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="venue-description">Description</Label>
                      <Textarea id="venue-description" placeholder="Enter venue description" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="venue-images">Images</Label>
                      <Input id="venue-images" type="file" multiple />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Venue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venue Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Courts</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell className="font-medium">{venue.name}</TableCell>
                      <TableCell>{venue.location}</TableCell>
                      <TableCell>{venue.sport}</TableCell>
                      <TableCell>{venue.courts}</TableCell>
                      <TableCell>{venue.rating}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            venue.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {venue.active ? "Active" : "Inactive"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trophy className="mr-2 h-4 w-4" />
                              Manage Courts
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
