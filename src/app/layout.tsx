import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oura + AI Chat Demo',
  description: 'Connect your Oura Ring data to personalized AI coaching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}