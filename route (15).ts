"use client"

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/index'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setLoading(false)
      setSubmitted(true) // Always show success to prevent email enumeration
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#1E3A5F]">ComplyFlow</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {submitted ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-sm text-gray-500">
                If an account exists for {email}, we've sent a password reset link.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h1>
              <p className="text-sm text-gray-500 mb-6">We'll send you a reset link</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" variant="navy" className="w-full" loading={loading}>
                  Send reset link
                </Button>
              </form>
            </>
          )}

          <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
