"use client"

import { useState, useEffect, useCallback } from 'react'
import { Plus, CheckCircle, AlertTriangle, Clock, Trash2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, Card, CardContent, Badge } from '@/components/ui/index'
import { formatDate, getDaysUntilDue, isDeadlineOverdue, isDeadlineUrgent } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'
import type { Deadline } from '@/types'

const CATEGORIES = [
  { value: 'ALL', label: 'All' },
  { value: 'ANNUAL_REPORT', label: 'Annual Report' },
  { value: 'TAX_FILING', label: 'Tax Filing' },
  { value: 'LICENSE_RENEWAL', label: 'License Renewal' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'OTHER', label: 'Other' },
]

export default function CompliancePage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('active')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'OTHER',
    recurring: false,
    reminderDays: [7, 1],
  })

  const fetchDeadlines = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter === 'completed') params.set('status', 'completed')
      const res = await fetch(`/api/compliance?${params}`)
      const data = await res.json()
      setDeadlines(data.deadlines || [])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchDeadlines() }, [fetchDeadlines])

  async function handleAddDeadline(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dueDate: new Date(form.dueDate).toISOString(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: data.error, variant: 'destructive' })
        return
      }
      toast({ title: 'Deadline added', variant: 'success' })
      setShowForm(false)
      setForm({ title: '', description: '', dueDate: '', category: 'OTHER', recurring: false, reminderDays: [7, 1] })
      fetchDeadlines()
    } finally {
      setSaving(false)
    }
  }

  async function toggleComplete(deadline: Deadline) {
    const res = await fetch(`/api/compliance/${deadline.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !deadline.completed }),
    })
    if (res.ok) {
      fetchDeadlines()
      toast({ title: deadline.completed ? 'Marked incomplete' : 'Marked complete!', variant: 'success' })
    }
  }

  async function deleteDeadline(id: string) {
    if (!confirm('Delete this deadline?')) return
    const res = await fetch(`/api/compliance/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchDeadlines()
      toast({ title: 'Deadline deleted', variant: 'success' })
    }
  }

  const filtered = deadlines.filter(d => filter === 'ALL' || d.category === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-gray-500 text-sm mt-1">Track deadlines and filings</p>
        </div>
        <Button variant="navy" onClick={() => setShowForm(s => !s)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add deadline
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">New Deadline</h2>
            <form onSubmit={handleAddDeadline} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Annual Report Filing"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CATEGORIES.filter(c => c.value !== 'ALL').map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Notes (optional)</Label>
                <Input
                  id="description"
                  placeholder="Additional notes..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={form.recurring}
                  onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="recurring" className="cursor-pointer">This is a recurring annual deadline</Label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" variant="navy" loading={saving}>Save deadline</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
          {['active', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors capitalize ${
                statusFilter === s ? 'bg-[#1E3A5F] text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === c.value ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No deadlines found</p>
            <p className="text-sm text-gray-400 mt-1">Add a deadline to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((deadline) => {
            const overdue = isDeadlineOverdue(deadline.dueDate)
            const urgent = isDeadlineUrgent(deadline.dueDate)
            const daysUntil = getDaysUntilDue(deadline.dueDate)

            return (
              <Card key={deadline.id} className={`transition-all ${deadline.completed ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <button
                    onClick={() => toggleComplete(deadline)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      deadline.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : overdue
                        ? 'border-red-400 hover:border-red-500'
                        : 'border-gray-300 hover:border-[#1E3A5F]'
                    }`}
                  >
                    {deadline.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${deadline.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {deadline.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-gray-400">{formatDate(deadline.dueDate)}</p>
                      <span className="text-xs text-gray-300">·</span>
                      <p className="text-xs text-gray-400">{deadline.category.replace(/_/g, ' ')}</p>
                      {deadline.recurring && (
                        <>
                          <span className="text-xs text-gray-300">·</span>
                          <p className="text-xs text-blue-500">Recurring</p>
                        </>
                      )}
                    </div>
                  </div>

                  {!deadline.completed && (
                    <Badge variant={overdue ? 'destructive' : urgent ? 'warning' : 'success'}>
                      {overdue ? (
                        <><AlertTriangle className="w-3 h-3 mr-1" /> {Math.abs(daysUntil)}d overdue</>
                      ) : daysUntil === 0 ? 'Due today' : (
                        <><Clock className="w-3 h-3 mr-1" /> {daysUntil}d left</>
                      )}
                    </Badge>
                  )}

                  <button
                    onClick={() => deleteDeadline(deadline.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
