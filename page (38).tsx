import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, prisma } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'overview'

    if (view === 'overview') {
      const [totalUsers, activeSubscriptions, totalDocuments, totalDeadlines, recentUsers] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } }),
          prisma.document.count(),
          prisma.deadline.count(),
          prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              email: true,
              name: true,
              subscriptionPlan: true,
              subscriptionStatus: true,
              createdAt: true,
            },
          }),
        ])

      const planBreakdown = await prisma.user.groupBy({
        by: ['subscriptionPlan'],
        _count: true,
      })

      return NextResponse.json({
        overview: {
          totalUsers,
          activeSubscriptions,
          totalDocuments,
          totalDeadlines,
        },
        recentUsers,
        planBreakdown,
      })
    }

    if (view === 'users') {
      const page = parseInt(searchParams.get('page') || '1')
      const pageSize = 20
      const search = searchParams.get('search') || ''

      const where = search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' as const } },
              { name: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
            createdAt: true,
            business: { select: { name: true, type: true, state: true } },
          },
        }),
        prisma.user.count({ where }),
      ])

      return NextResponse.json({ users, total, page, pageSize })
    }

    if (view === 'tickets') {
      const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: { select: { email: true, name: true } },
        },
      })
      return NextResponse.json({ tickets })
    }

    return NextResponse.json({ error: 'Invalid view' }, { status: 400 })
  } catch (error) {
    console.error('Admin GET error:', error)
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
