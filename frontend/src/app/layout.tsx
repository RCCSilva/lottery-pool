import type { Metadata } from 'next'
import StyledComponentsRegistry from './registry'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lottery Pool',
  description: 'Lottery pool application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}

