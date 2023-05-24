// React
import React from 'react'

// Vercel
import { Analytics } from '@vercel/analytics/react';

// Ours
import '@/app/globals.css'

export const metadata = {
  title: 'Tactical Elements',
  description: 'Chess learning tools and games'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 bg-forest bg-cover font-body text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
