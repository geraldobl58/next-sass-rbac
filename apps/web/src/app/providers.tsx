'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryCLient } from '@/lib/react-query'

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryCLient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
