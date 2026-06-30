import { requireAdmin, prisma } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui/index'
import { formatDate } from '@/lib/utils'
import { Users, CreditCard, FileText, Calendar } from 'lucide-react'

export default async function AdminPage() {
  let user
  try {
    user = await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  const [totalUsers, activeSubscriptions, totalDocuments, totalDeadlines, recentUsers, planBreakdown] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      prisma.document.count(),
      prisma.deadline.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true, email: true, name: true,
          subscriptionPlan: true, subscriptionStatus: true, createdAt: true,
        },
      }),
      prisma.user.groupBy({ by: ['subscriptionPlan'], _count: true }),
    ])

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Subscriptions', value: activeSubscriptions, icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Documents', value: totalDocuments, icon: FileText, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Deadlines', value: totalDeadlines, icon: Calendar, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform analytics and user management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Signups</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name || u.email}</p>
                    <p className="text-xs text-gray-400">{u.email} · {formatDate(u.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.subscriptionStatus === 'ACTIVE' ? 'success' : 'secondary'}>
                      {u.subscriptionPlan}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {planBreakdown.map((p: any) => (
              <div key={p.subscriptionPlan} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{p.subscriptionPlan}</span>
                <span className="text-sm font-bold text-gray-900">{p._count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
