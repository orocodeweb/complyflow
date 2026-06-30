"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, Badge } from '@/components/ui/index'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  subscriptionPlan: string
  subscriptionStatus: string
  createdAt: string
  business: { name: string; type: string; state: string } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      fetch(`/api/admin?view=users&search=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => setUsers(data.users || []))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage platform users and subscriptions</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{u.name || '—'}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {u.business ? `${u.business.name} (${u.business.state})` : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant="secondary">{u.subscriptionPlan}</Badge>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={u.subscriptionStatus === 'ACTIVE' ? 'success' : 'outline'}>
                        {u.subscriptionStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
