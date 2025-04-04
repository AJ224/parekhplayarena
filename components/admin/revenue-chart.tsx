"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "01/04", revenue: 5200 },
  { date: "02/04", revenue: 7800 },
  { date: "03/04", revenue: 6500 },
  { date: "04/04", revenue: 9100 },
  { date: "05/04", revenue: 10400 },
  { date: "06/04", revenue: 13800 },
  { date: "07/04", revenue: 12100 },
  { date: "08/04", revenue: 8200 },
  { date: "09/04", revenue: 9900 },
  { date: "10/04", revenue: 11200 },
  { date: "11/04", revenue: 10300 },
  { date: "12/04", revenue: 12500 },
  { date: "13/04", revenue: 13400 },
  { date: "14/04", revenue: 11600 },
]

export function AdminRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
        <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

