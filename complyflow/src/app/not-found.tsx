import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#1E3A5F] rounded-xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">This page doesn't exist.</p>
        <Link href="/" className="text-sm font-medium text-[#1E3A5F] hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
