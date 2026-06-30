"use client"

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, Badge } from '@/components/ui/index'
import { formatDate, isDeadlineOverdue } from '@/lib/utils'
import type { Deadline } from '@/types'

export default function CalendarPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  const fetchDeadlines = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/compliance')
      const data = await res.json()
      setDeadlines(data.deadlines || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDeadlines() }, [fetchDeadlines])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const deadlinesByDay = new Map<number, Deadline[]>()
  deadlines.forEach((d) => {
    const due = new Date(d.dueDate)
    if (due.getFullYear() === year && due.getMonth() === month) {
      const day = due.getDate()
      if (!deadlinesByDay.has(day)) deadlinesByDay.set(day, [])
      deadlinesByDay.get(day)!.push(d)
    }
  })

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const upcomingThisMonth = deadlines
    .filter(d => {
      const due = new Date(d.dueDate)
      return due.getFullYear() === year && due.getMonth() === month && !d.completed
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Visualize deadlines across the year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{monthName}</h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-2.5 py-1 text-xs rounded hover:bg-gray-100 transition-colors text-gray-500 font-medium"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} className="aspect-square" />

                const dayDeadlines = deadlinesByDay.get(day) || []
                const isToday = isCurrentMonth && today.getDate() === day
                const hasOverdue = dayDeadlines.some(d => !d.completed && isDeadlineOverdue(d.dueDate))

                return (
                  <div
                    key={i}
                    className={`aspect-square border rounded-lg p-1.5 flex flex-col ${
                      isToday ? 'border-[#1E3A5F] bg-[#EEF2FF]' : 'border-gray-100'
                    }`}
                  >
                    <span className={`text-xs ${isToday ? 'font-bold text-[#1E3A5F]' : 'text-gray-500'}`}>
                      {day}
                    </span>
                    <div className="flex-1 flex flex-col gap-0.5 mt-0.5 overflow-hidden">
                      {dayDeadlines.slice(0, 2).map(d => (
                        <div
                          key={d.id}
                          className={`text-[10px] truncate rounded px-1 py-0.5 ${
                            d.completed
                              ? 'bg-gray-100 text-gray-400 line-through'
                              : hasOverdue
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                          title={d.title}
                        >
                          {d.title}
                        </div>
                      ))}
                      {dayDeadlines.length > 2 && (
                        <span className="text-[10px] text-gray-400">+{dayDeadlines.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* This month's deadlines */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Deadlines this month</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : upcomingThisMonth.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Nothing due this month</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingThisMonth.map(d => {
                  const overdue = isDeadlineOverdue(d.dueDate)
                  return (
                    <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                      {overdue ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 ml-1" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{d.title}</p>
                        <p className="text-xs text-gray-400">{formatDate(d.dueDate)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
