import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ComplyFlow — Business Compliance Made Simple',
    template: '%s | ComplyFlow',
  },
  description: 'ComplyFlow is a software platform that helps small business owners track compliance deadlines, manage business documents, and stay organized. We are not a law firm or CPA.',
  keywords: [
    'business compliance software',
    'LLC compliance tracker',
    'business dashboard tool',
    'small business organization software',
    'compliance calendar app',
    'business document management software',
  ],
  authors: [{ name: 'ComplyFlow' }],
  creator: 'ComplyFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'ComplyFlow — Business Compliance Made Simple',
    description: 'Track compliance deadlines, manage documents, and stay on top of your business with ComplyFlow.',
    siteName: 'ComplyFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ComplyFlow — Business Compliance Made Simple',
    description: 'Track compliance deadlines, manage documents, and stay on top of your business with ComplyFlow.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
