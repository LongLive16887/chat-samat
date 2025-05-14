import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import RegisterSW from "./register-sw"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Чат в реальном времени | PWA",
  description: "Приложение для чата в реальном времени между пользователями",
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Чат в реальном времени",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/svg+xml" }],
    apple: [{ url: "/icon.png", type: "image/svg+xml" }],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <RegisterSW />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
