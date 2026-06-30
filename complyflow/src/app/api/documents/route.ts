import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, prisma } from '@/lib/auth'
import { z } from 'zod'

const createDocSchema = z.object({
  name: z.string().min(1).max(255),
  originalName: z.string(),
  size: z.number().positive(),
  mimeType: z.string(),
  url: z.string().url(),
  folder: z.enum(['LEGAL', 'TAX', 'CONTRACTS', 'INSURANCE', 'GOVERNMENT', 'OTHER']).default('OTHER'),
  tags: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = { userId: user.id }
    if (folder && folder !== 'ALL') where.folder = folder
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Documents GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const parsed = createDocSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    // Check storage limits based on plan
    const existingDocs = await prisma.document.findMany({
      where: { userId: user.id },
      select: { size: true },
    })

    const totalUsedBytes = existingDocs.reduce((sum, doc) => sum + doc.size, 0)
    const limits: Record<string, number> = {
      FREE: 100 * 1024 * 1024, // 100MB
      STARTER: 5 * 1024 * 1024 * 1024, // 5GB
      PROFESSIONAL: 25 * 1024 * 1024 * 1024, // 25GB
      BUSINESS: 100 * 1024 * 1024 * 1024, // 100GB
    }

    const limit = limits[user.subscriptionPlan] || limits.FREE
    if (totalUsedBytes + parsed.data.size > limit) {
      return NextResponse.json(
        { error: 'Storage limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    const document = await prisma.document.create({
      data: {
        ...parsed.data,
        userId: user.id,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    })

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    console.error('Documents POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
