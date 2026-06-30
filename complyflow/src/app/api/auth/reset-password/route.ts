import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, hashPassword } from '@/lib/auth'
import jwt from 'jsonwebtoken'

const schema = z.object({
  token: z.string(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { token, password } = parsed.data

    let payload: { userId: string; purpose: string }
    try {
      payload = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    } catch {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    if (payload.purpose !== 'password-reset') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
