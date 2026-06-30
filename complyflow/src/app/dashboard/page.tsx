import { getCurrentUser, prisma } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatDate, getDaysUntilDue, isDeadlineOverdue, isDeadlineUrgent, getComplianceScoreColor, getComplianceScoreLabel, formatBytes, calculateComplianceScore } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui/index'
import { AlertTriangle, CheckCircle, Clock, FileText, Plus, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  if (!user.business?.onboardingComplete) {
    redirect('/onboarding')
  }

  // Fetch dashboard data
  const [deadlines, documents, notifications] = await Promise.all([
    prisma.deadline.findMany({
      where: { userId: user.id, completed: false },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }),
    prisma.document.findMany({
      where: { userId: user.id },
      select: { id: true, size: true },
    }),
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const overdueDeadlines = deadlines.filter(d => isDeadlineOverdue(d.dueDate))
  const upcomingDeadlines = deadlines.filter(d => !isDeadlineOverdue(d.dueDate))
  const urgentDeadlines = upcomingDeadlines.filter(d => isDeadlineUrgent(d.dueDate))

  const allDeadlines = await prisma.deadline.count({ where: { userId: user.id } })
  const completedDeadlines = await prisma.deadline.count({ where: { userId: user.id, completed: true } })

  const score = calculateComplianceScore({
    totalDeadlines: allDeadlines,
    completedDeadlines,
    overdueDeadlines: overdueDeadlines.length,
    documentCount: documents.length,
    hasProfile: !!user.business,
  })

  const totalStorageBytes = documents.reduce((sum, d) => sum + d.size, 0)

  const scoreColor = getComplianceScoreColor(score)
  const scoreLabel = getComplianceScoreLabel(score)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good {getGreeting()}, {user.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user.business?.name} · {user.business?.state}
          </p>
        </div>
        <Link
          href="/compliance"
          className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152b46] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add deadline
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{score}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Compliance Score</p>
              <p className={`text-lg font-bold ${scoreColor}`}>{scoreLabel}</p>
              <p className="text-xs text-gray-400 mt-1">{completedDeadlines}/{allDeadlines} tasks done</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Overdue</p>
              <AlertTriangle className={`w-4 h-4 ${overdueDeadlines.length > 0 ? 'text-red-500' : 'text-gray-300'}`} />
            </div>
            <p className={`text-2xl font-bold ${overdueDeadlines.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {overdueDeadlines.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">deadlines past due</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Upcoming</p>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{urgentDeadlines.length}</p>
            <p className="text-xs text-gray-400 mt-1">due within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Documents</p>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            <p className="text-xs text-gray-400 mt-1">{formatBytes(totalStorageBytes)} used</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming deadlines */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
              <Link href="/compliance" className="text-xs text-[#1E3A5F] hover:underline font-medium">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {overdueDeadlines.length === 0 && upcomingDeadlines.length === 0 ? (
              <div className="text-center py-12 px-6">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">All clear!</p>
                <p className="text-xs text-gray-400 mt-1">No upcoming deadlines. Add some to get started.</p>
                <Link href="/compliance" className="inline-flex items-center gap-1 text-xs text-[#1E3A5F] hover:underline mt-3 font-medium">
                  <Plus className="w-3 h-3" /> Add a deadline
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {[...overdueDeadlines, ...upcomingDeadlines].slice(0, 6).map((deadline) => {
                  const overdue = isDeadlineOverdue(deadline.dueDate)
                  const urgent = isDeadlineUrgent(deadline.dueDate)
                  const daysUntil = getDaysUntilDue(deadline.dueDate)
                  return (
                    <div key={deadline.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${overdue ? 'bg-red-500' : urgent ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{deadline.title}</p>
                        <p className="text-xs text-gray-400">{formatDate(deadline.dueDate)}</p>
                      </div>
                      <Badge variant={overdue ? 'destructive' : urgent ? 'warning' : 'success'}>
                        {overdue ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? 'Today' : `${daysUntil}d left`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              <Link href="/notifications" className="text-xs text-[#1E3A5F] hover:underline font-medium">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-sm text-gray-400">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div key={n.id} className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan upgrade banner for free users */}
      {user.subscriptionPlan === 'FREE' && (
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7f] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-200" />
              <p className="text-sm font-semibold text-white">Upgrade to unlock full compliance tracking</p>
            </div>
            <p className="text-xs text-blue-200">Get unlimited deadlines, 5GB storage, AI assistant, and email reminders.</p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 bg-white text-[#1E3A5F] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors ml-4"
          >
            Upgrade
          </Link>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
