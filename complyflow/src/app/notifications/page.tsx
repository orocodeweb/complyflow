"use client"

import { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Card, CardContent, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { formatDateRelative } from '@/lib/utils'
import type { Notification } from '@/types'

const TYPE_COLORS: Record<string, string> = {
  DEADLINE: 'warning',
  DOCUMENT: 'default',
  SUBSCRIPTION: 'destructive',
  SYSTEM: 'secondary',
  SUPPORT: 'success',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data.notifications || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    })
    fetchNotifications()
  }

  async function markRead(id: string) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchNotifications()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead} className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">You're all caught up</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <Card
              key={n.id}
              className={`cursor-pointer transition-colors ${!n.read ? 'border-l-4 border-l-[#1E3A5F]' : ''}`}
              onClick={() => !n.read && markRead(n.id)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <Badge variant={(TYPE_COLORS[n.type] as any) || 'default'} className="mt-0.5">
                  {n.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-300 mt-1">{formatDateRelative(n.createdAt)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#1E3A5F] flex-shrink-0 mt-1.5" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
