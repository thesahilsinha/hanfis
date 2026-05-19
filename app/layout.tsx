import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Hanfi's Collection — Premium Mobiles Mumbai",
  description: 'Buy new & certified refurbished smartphones. iPhone, Samsung, OnePlus & more. No Cost EMI. Free delivery in Mumbai.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}