"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "01/04", bookings: 12 },
  { date: "02/04", bookings: 18 },
  { date: "03/04", bookings: 15 },
  { date: "04/04", bookings: 21 },
  { date: "05/04", bookings: 24 },
  { date: "06/04", bookings: 32 },
  { date: "07/04", bookings: 28 },
  { date: "08/04", bookings: 19 },
  { date: "09/04", bookings: 23 },
  { date: "10/04", bookings: 26 },
  { date: "11/04", bookings: 24 },
  { date: "12/04", bookings: 29 },
  { date: "13/04", bookings: 31 },
  { date: "14/04", bookings: 27 },
]

export function AdminBookingChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="bookings" fill="#16a34a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

