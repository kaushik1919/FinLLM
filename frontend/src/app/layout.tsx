'use client'

import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  )

  return (
    <html lang="en" className="dark">
      <head>
        <title>FinLLM — Financial Intelligence</title>
        <meta name="description" content="AI-powered financial document analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-bg-base text-text-primary antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#18181f',
                border: '1px solid #2a2a38',
                color: '#e8e8f0',
              },
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  )
}
