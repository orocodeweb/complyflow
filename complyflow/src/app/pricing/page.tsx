"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Check, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Get started with basic compliance tracking',
    features: [
      'Up to 3 compliance deadlines',
      '100MB document storage',
      'Basic compliance calendar',
      'Email reminders',
    ],
    cta: 'Start free',
    href: '/register',
  },
  {
    name: 'Starter',
    monthlyPrice: 19,
    annualPrice: 15,
    priceIdMonthly: 'starter_monthly',
    priceIdAnnual: 'starter_annual',
    description: 'For solo founders and freelancers',
    features: [
      'Unlimited compliance deadlines',
      '5GB document storage',
      'Full compliance calendar',
      'Email & SMS reminders',
      'AI assistant',
      'Compliance score tracking',
    ],
    cta: 'Start 14-day trial',
    popular: true,
  },
  {
    name: 'Professional',
    monthlyPrice: 49,
    annualPrice: 39,
    priceIdMonthly: 'professional_monthly',
    priceIdAnnual: 'professional_annual',
    description: 'For growing businesses with more to track',
    features: [
      'Everything in Starter',
      '25GB document storage',
      'Document expiration tracking',
      'Priority email support',
      'Advanced compliance reporting',
      'Custom deadline categories',
    ],
    cta: 'Start 14-day trial',
  },
  {
    name: 'Business',
    monthlyPrice: 99,
    annualPrice: 79,
    priceIdMonthly: 'business_monthly',
    priceIdAnnual: 'business_annual',
    description: 'For multi-entity operators and teams',
    features: [
      'Everything in Professional',
      '100GB document storage',
      'Multiple business profiles',
      'Dedicated support',
      'API access (coming soon)',
      'Team collaboration (coming soon)',
    ],
    cta: 'Start 14-day trial',
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1E3A5F]">ComplyFlow</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[#1E3A5F]">
            Sign in
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-500">Start free. Upgrade when you need more.</p>

          <div className="inline-flex items-center gap-3 mt-6 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Annual <span className="text-emerald-600">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.popular ? 'border-[#1E3A5F] shadow-lg relative' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-400 mb-4 h-8">{plan.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-sm text-gray-400">/mo</span>
                {annual && plan.monthlyPrice > 0 && (
                  <p className="text-xs text-gray-400 mt-1">billed annually</p>
                )}
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href || '/register'}>
                <Button variant={plan.popular ? 'navy' : 'outline'} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 max-w-2xl mx-auto leading-relaxed">
          All plans include a 14-day free trial on paid tiers. ComplyFlow is a software platform that provides
          business organization tools, templates, and compliance tracking. We are not affiliated with any
          government agency and do not provide legal, tax, or accounting advice.
        </p>
      </div>
    </div>
  )
}
