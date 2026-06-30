import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, prisma } from '@/lib/auth'
import { z } from 'zod'

const businessSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['LLC', 'SOLE_PROPRIETORSHIP', 'S_CORP', 'C_CORP', 'PARTNERSHIP', 'NONPROFIT', 'OTHER']),
  state: z.string().min(1),
  industry: z.string().min(1),
  formationDate: z.string().datetime().optional().nullable(),
  employeeCount: z.enum(['SOLO', 'TWO_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_FIFTY', 'FIFTY_PLUS']).default('SOLO'),
  filingFrequency: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).default('ANNUAL'),
  ein: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
})

export async function GET() {
  try {
    const user = await requireAuth()
    const business = await prisma.business.findUnique({
      where: { userId: user.id },
    })
    return NextResponse.json({ business })
  } catch (error) {
    console.error('Business GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const parsed = businessSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const existing = await prisma.business.findUnique({ where: { userId: user.id } })

    const data = {
      ...parsed.data,
      formationDate: parsed.data.formationDate ? new Date(parsed.data.formationDate) : null,
      website: parsed.data.website || null,
      onboardingComplete: true,
    }

    let business
    if (existing) {
      business = await prisma.business.update({ where: { userId: user.id }, data })
    } else {
      business = await prisma.business.create({ data: { ...data, userId: user.id } })

      // Seed default compliance deadlines for new businesses
      await seedDefaultDeadlines(user.id, parsed.data.state, parsed.data.type)
    }

    return NextResponse.json({ business })
  } catch (error) {
    console.error('Business POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function seedDefaultDeadlines(userId: string, state: string, businessType: string) {
  const currentYear = new Date().getFullYear()
  const defaults = [
    {
      title: `${currentYear} Annual Report Filing`,
      description: `File your annual report with the state of ${state}`,
      dueDate: new Date(`${currentYear}-12-31T23:59:00Z`),
      category: 'ANNUAL_REPORT' as const,
      recurring: true,
      recurrencePattern: 'yearly',
      reminderDays: [30, 14, 7, 1],
    },
    {
      title: 'Federal Tax Return (Form 1040 / 1065 / 1120)',
      description: 'Annual federal income tax filing deadline',
      dueDate: new Date(`${currentYear}-04-15T23:59:00Z`),
      category: 'TAX_FILING' as const,
      recurring: true,
      recurrencePattern: 'yearly',
      reminderDays: [60, 30, 14, 7],
    },
    {
      title: 'Business License Renewal Review',
      description: 'Review and renew any local/state business licenses',
      dueDate: new Date(`${currentYear}-12-01T23:59:00Z`),
      category: 'LICENSE_RENEWAL' as const,
      recurring: true,
      recurrencePattern: 'yearly',
      reminderDays: [30, 14],
    },
  ]

  await prisma.deadline.createMany({
    data: defaults.map((d) => ({ ...d, userId })),
    skipDuplicates: true,
  })
}
