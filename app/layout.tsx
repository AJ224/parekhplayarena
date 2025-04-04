import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parekh Play Arena',
  description: 'Created with ParekhPlay',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
