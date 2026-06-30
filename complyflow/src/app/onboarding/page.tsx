"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ChevronRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/index'
import { US_STATES, INDUSTRIES } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'

const BUSINESS_TYPES = [
  { value: 'LLC', label: 'LLC', description: 'Limited Liability Company' },
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship', description: 'Individual business owner' },
  { value: 'S_CORP', label: 'S-Corp', description: 'S Corporation' },
  { value: 'C_CORP', label: 'C-Corp', description: 'C Corporation' },
  { value: 'PARTNERSHIP', label: 'Partnership', description: 'General or limited partnership' },
  { value: 'NONPROFIT', label: 'Nonprofit', description: '501(c)(3) or similar' },
  { value: 'OTHER', label: 'Other', description: 'Another structure' },
]

const EMPLOYEE_OPTIONS = [
  { value: 'SOLO', label: 'Just me' },
  { value: 'TWO_TO_FIVE', label: '2-5 employees' },
  { value: 'SIX_TO_TEN', label: '6-10 employees' },
  { value: 'ELEVEN_TO_FIFTY', label: '11-50 employees' },
  { value: 'FIFTY_PLUS', label: '50+ employees' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: '',
    state: '',
    industry: '',
    formationDate: '',
    employeeCount: 'SOLO',
    filingFrequency: 'ANNUAL',
    ein: '',
    website: '',
    phone: '',
    address: '',
  })

  const totalSteps = 3

  function updateForm(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          formationDate: form.formationDate ? new Date(form.formationDate).toISOString() : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast({ title: data.error || 'Failed to save', variant: 'destructive' })
        return
      }

      toast({ title: 'Business profile created!', variant: 'success' })
      router.push('/dashboard')
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return form.name && form.type
    if (step === 2) return form.state && form.industry
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#1E3A5F]">ComplyFlow</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-[#1E3A5F]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-5 h-5 text-[#1E3A5F]" />
                  <h1 className="text-xl font-bold text-gray-900">Tell us about your business</h1>
                </div>
                <p className="text-sm text-gray-500">Step 1 of {totalSteps}</p>
              </div>

              <div>
                <Label htmlFor="name">Business name</Label>
                <Input
                  id="name"
                  placeholder="Acme LLC"
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Business type</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {BUSINESS_TYPES.map(bt => (
                    <button
                      key={bt.value}
                      type="button"
                      onClick={() => updateForm('type', bt.value)}
                      className={`text-left p-3 border rounded-lg transition-colors ${
                        form.type === bt.value
                          ? 'border-[#1E3A5F] bg-[#EEF2FF]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">{bt.label}</p>
                      <p className="text-xs text-gray-400">{bt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Location & industry</h1>
                <p className="text-sm text-gray-500">Step 2 of {totalSteps}</p>
              </div>

              <div>
                <Label htmlFor="state">State of formation</Label>
                <select
                  id="state"
                  value={form.state}
                  onChange={e => updateForm('state', e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a state...</option>
                  {US_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  value={form.industry}
                  onChange={e => updateForm('industry', e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select an industry...</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="formationDate">Formation date (optional)</Label>
                <Input
                  id="formationDate"
                  type="date"
                  value={form.formationDate}
                  onChange={e => updateForm('formationDate', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Number of employees</Label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {EMPLOYEE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateForm('employeeCount', opt.value)}
                      className={`p-2.5 text-sm border rounded-lg transition-colors ${
                        form.employeeCount === opt.value
                          ? 'border-[#1E3A5F] bg-[#EEF2FF] text-[#1E3A5F] font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Optional details</h1>
                <p className="text-sm text-gray-500">Step 3 of {totalSteps} — you can skip this</p>
              </div>

              <div>
                <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
                <Input
                  id="ein"
                  placeholder="XX-XXXXXXX"
                  value={form.ein}
                  onChange={e => updateForm('ein', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="website">Business website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://mybusiness.com"
                  value={form.website}
                  onChange={e => updateForm('website', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="phone">Business phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={e => updateForm('phone', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="address">Business address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  value={form.address}
                  onChange={e => updateForm('address', e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <Button
                variant="navy"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="navy"
                onClick={handleSubmit}
                loading={loading}
                className="flex items-center gap-2"
              >
                Set up my dashboard <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed max-w-sm mx-auto">
          This information is used to personalize your compliance calendar. ComplyFlow does not provide legal or tax advice.
        </p>
      </div>
    </div>
  )
}
