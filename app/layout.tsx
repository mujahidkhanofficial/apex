import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "ApexMediaDigital | Digital Agency - Web Development, SEO & Graphic Design Services",
  description:
    "We craft digital experiences that elevate your brand. Full-stack development, SEO, design, and e-commerce solutions.",
  icons: {
    icon: "/fav.ico",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-foreground bg-background">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
