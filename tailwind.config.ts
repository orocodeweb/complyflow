import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt,
        subscriptionEndsAt: user.subscriptionEndsAt,
        business: user.business,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
