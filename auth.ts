import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import jwt from 'jsonwebtoken'

const schema = z.object({ email: z.string().email() })

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`forgot-password:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
    }

    const email = parsed.data.email.toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email } })

    // Always return the same response to prevent email enumeration
    if (user) {
      const token = jwt.sign(
        { userId: user.id, purpose: 'password-reset' },
        process.env.NEXTAUTH_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      )
      sendPasswordResetEmail(email, token).catch(console.error)
    }

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
  }
}
