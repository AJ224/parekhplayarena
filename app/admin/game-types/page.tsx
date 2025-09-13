"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Settings, Trash } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function GameTypesPage() {
  const [gameTypes, setGameTypes] = useState([
    {
      id: 1,
      name: "Basketball - Full Court",
      sport: "Basketball",
      minPlayers: 6,
      maxPlayers: 10,
      duration: 60,
      price: 500,
      active: true,
    },
    {
      id: 2,
      name: "Basketball - Half Court",
      sport: "Basketball",
      minPlayers: 2,
      maxPlayers: 6,
      duration: 60,
      price: 300,
      active: true,
    },
    {
      id: 3,
      name: "Football - 5-a-side",
      sport: "Football",
      minPlayers: 6,
      maxPlayers: 10,
      duration: 60,
      price: 800,
      active: true,
    },
    {
      id: 4,
      name: "Football - 7-a-side",
      sport: "Football",
      minPlayers: 8,
      maxPlayers: 14,
      duration: 90,
      price: 1200,
      active: true,
    },
    {
      id: 5,
      name: "Cricket - T20",
      sport: "Cricket",
      minPlayers: 12,
      maxPlayers: 22,
      duration: 180,
      price: 1500,
      active: true,
    },
    {
      id: 6,
      name: "Badminton - Singles",
      sport: "Badminton",
      minPlayers: 2,
      maxPlayers: 2,
      duration: 60,
      price: 400,
      active: true,
    },
    {
      id: 7,
      name: "Badminton - Doubles",
      sport: "Badminton",
      minPlayers: 4,
      maxPlayers: 4,
      duration: 60,
      price: 400,
      active: true,
    },
  ])

  const [rules, setRules] = useState([
    {
      id: 1,
      title: "Basketball Court Rules",
      sport: "Basketball",
      description: "Standard basketball rules apply. No rough play allowed.",
      active: true,
    },
    {
      id: 2,
      title: "Football Field Rules",
      sport: "Football",
      description: "Standard football rules apply. No metal studs allowed.",
      active: true,
    },
    {
      id: 3,
      title: "Cricket Pitch Rules",
      sport: "Cricket",
      description: "Standard cricket rules apply. Bring your own equipment.",
      active: true,
    },
    {
      id: 4,
      title: "Badminton Court Rules",
      sport: "Badminton",
      description: "Standard badminton rules apply. Non-marking shoes required.",
      active: true,
    },
    {
      id: 5,
      title: "Tennis Court Rules",
      sport: "Tennis",
      description: "Standard tennis rules apply. Proper tennis shoes required.",
      active: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Game Types & Rules Management</h1>
      </div>

      <Tabs defaultValue="game-types">
        <TabsList>
          <TabsTrigger value="game-types">Game Types</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="game-types" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Game Types</CardTitle>
                <CardDescription>Manage different game types and their configurations</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Game Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Game Type</DialogTitle>
                    <DialogDescription>Configure a new game type for a sport</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="game-name">Game Type Name</Label>
                      <Input id="game-name" placeholder="Enter game type name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="game-sport">Sport</Label>
                      <select
                        id="game-sport"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a sport</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Tennis">Tennis</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-players">Min Players</Label>
                        <Input id="min-players" type="number" min="1" placeholder="Min players" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-players">Max Players</Label>
                        <Input id="max-players" type="number" min="1" placeholder="Max players" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" type="number" min="15" step="15" placeholder="Duration" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" type="number" min="0" placeholder="Price" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="game-description">Description</Label>
                      <Textarea id="game-description" placeholder="Enter game type description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Game Type</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Type</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameTypes.map((gameType) => (
                    <TableRow key={gameType.id}>
                      <TableCell className="font-medium">{gameType.name}</TableCell>
                      <TableCell>{gameType.sport}</TableCell>
                      <TableCell>
                        {gameType.minPlayers}-{gameType.maxPlayers}
                      </TableCell>
                      <TableCell>{gameType.duration} min</TableCell>
                      <TableCell>₹{gameType.price}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            gameType.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {gameType.active ? "Active" : "Inactive"}
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
                              <Settings className="mr-2 h-4 w-4" />
                              Configure Rules
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

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rules</CardTitle>
                <CardDescription>Manage rules for different sports and venues</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rules
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Rules</DialogTitle>
                    <DialogDescription>Create rules for a sport or venue</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="rule-title">Rule Title</Label>
                      <Input id="rule-title" placeholder="Enter rule title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rule-sport">Sport</Label>
                      <select
                        id="rule-sport"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a sport</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Tennis">Tennis</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rule-venue">Venue (Optional)</Label>
                      <select
                        id="rule-venue"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">All Venues</option>
                        <option value="Hoops Arena">Hoops Arena</option>
                        <option value="Green Field">Green Field</option>
                        <option value="Smash Court">Smash Court</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rule-description">Rules Description</Label>
                      <Textarea id="rule-description" placeholder="Enter rules description" rows={5} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="rule-active" defaultChecked />
                      <Label htmlFor="rule-active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Rules</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.title}</TableCell>
                      <TableCell>{rule.sport}</TableCell>
                      <TableCell className="max-w-xs truncate">{rule.description}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rule.active ? "Active" : "Inactive"}
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
