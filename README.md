import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, hashPassword, signToken, setAuthCookie } from '@/lib/auth'
import { createStripeCustomer } from '@/lib/stripe'
import { sendWelcomeEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per IP per hour
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    // Create Stripe customer
    let stripeCustomerId: string | undefined
    try {
      const customer = await createStripeCustomer(normalizedEmail, name)
      stripeCustomerId = customer.id
    } catch (err) {
      console.error('Failed to create Stripe customer:', err)
      // Non-fatal — user can still register
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        stripeCustomerId,
      },
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(normalizedEmail, name).catch(console.error)

    // Sign JWT and set cookie
    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    setAuthCookie(token)

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
