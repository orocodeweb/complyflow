import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, comparePassword, signToken, setAuthCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 attempts per IP per 15 minutes
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const { email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { business: true },
    })

    if (!user || !user.password) {
      // Use constant-time comparison to prevent timing attacks
      await comparePassword(password, '$2a$12$placeholder.hash.for.timing')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    setAuthCookie(token)

    return NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        onboardingComplete: user.business?.onboardingComplete ?? false,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
