import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Dream',
  description: 'Stop talking. Start proving.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900">
        <Navbar />
        {children}
      </body>
    </html>
  )
}