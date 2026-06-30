"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Label, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toaster'
import { formatDate } from '@/lib/utils'
import { CreditCard, User as UserIcon, Building2, Bell } from 'lucide-react'

interface UserData {
  id: string
  email: string
  name: string | null
  subscriptionPlan: string
  subscriptionStatus: string
  trialEndsAt: string | null
  subscriptionEndsAt: string | null
  business: any
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [businessForm, setBusinessForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        if (data.user?.business) setBusinessForm(data.user.business)
      })
      .finally(() => setLoading(false))
  }, [])

  async function openBillingPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast({ title: data.error || 'Could not open billing portal', variant: 'destructive' })
      }
    } finally {
      setPortalLoading(false)
    }
  }

  async function saveBusinessProfile() {
    setSaving(true)
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessForm),
      })
      if (res.ok) {
        toast({ title: 'Business profile updated', variant: 'success' })
      } else {
        const data = await res.json()
        toast({ title: data.error, variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and business profile</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserIcon className="w-4 h-4" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Name</span>
            <span className="text-sm font-medium text-gray-900">{user.name || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-medium text-gray-900">{user.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Billing & Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{user.subscriptionPlan}</span>
                <Badge variant={user.subscriptionStatus === 'ACTIVE' ? 'success' : 'secondary'}>
                  {user.subscriptionStatus}
                </Badge>
              </div>
              {user.subscriptionEndsAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Renews {formatDate(user.subscriptionEndsAt)}
                </p>
              )}
              {user.trialEndsAt && (
                <p className="text-xs text-amber-600 mt-1">
                  Trial ends {formatDate(user.trialEndsAt)}
                </p>
              )}
            </div>
            <Button variant="navy" onClick={openBillingPortal} loading={portalLoading}>
              Manage billing
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Manage your subscription, payment methods, and invoices through Stripe's secure customer portal.
          </p>
        </CardContent>
      </Card>

      {/* Business Profile */}
      {businessForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Business Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bizName">Business name</Label>
                <Input
                  id="bizName"
                  value={businessForm.name || ''}
                  onChange={e => setBusinessForm((f: any) => ({ ...f, name: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="bizState">State</Label>
                <Input
                  id="bizState"
                  value={businessForm.state || ''}
                  onChange={e => setBusinessForm((f: any) => ({ ...f, state: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="bizPhone">Phone</Label>
                <Input
                  id="bizPhone"
                  value={businessForm.phone || ''}
                  onChange={e => setBusinessForm((f: any) => ({ ...f, phone: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="bizWebsite">Website</Label>
                <Input
                  id="bizWebsite"
                  value={businessForm.website || ''}
                  onChange={e => setBusinessForm((f: any) => ({ ...f, website: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button variant="navy" onClick={saveBusinessProfile} loading={saving}>
              Save changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Email reminders</p>
              <p className="text-xs text-gray-400">Get notified before deadlines are due</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">SMS reminders</p>
              <p className="text-xs text-gray-400">Optional text message alerts (Professional+ plans)</p>
            </div>
            <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
