import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, prisma } from '@/lib/auth'
import { z } from 'zod'

const deadlineSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  category: z.enum(['ANNUAL_REPORT', 'TAX_FILING', 'LICENSE_RENEWAL', 'INSURANCE', 'CONTRACT', 'GOVERNMENT', 'INTERNAL', 'OTHER']),
  recurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  reminderDays: z.array(z.number()).default([7, 1]),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // upcoming | overdue | completed
    const category = searchParams.get('category')

    const now = new Date()
    const where: Record<string, unknown> = { userId: user.id }

    if (status === 'upcoming') {
      where.dueDate = { gte: now }
      where.completed = false
    } else if (status === 'overdue') {
      where.dueDate = { lt: now }
      where.completed = false
    } else if (status === 'completed') {
      where.completed = true
    }

    if (category) where.category = category

    const deadlines = await prisma.deadline.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json({ deadlines })
  } catch (error) {
    console.error('Deadlines GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    // Check deadline limit for free plan
    if (user.subscriptionPlan === 'FREE') {
      const count = await prisma.deadline.count({ where: { userId: user.id } })
      if (count >= 3) {
        return NextResponse.json(
          { error: 'Free plan is limited to 3 deadlines. Please upgrade to add more.' },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const parsed = deadlineSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const deadline = await prisma.deadline.create({
      data: {
        ...parsed.data,
        userId: user.id,
        dueDate: new Date(parsed.data.dueDate),
      },
    })

    return NextResponse.json({ deadline }, { status: 201 })
  } catch (error) {
    console.error('Deadlines POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
