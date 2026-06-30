import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth, prisma } from '@/lib/auth'
import { createCheckoutSession, createStripeCustomer } from '@/lib/stripe'

const checkoutSchema = z.object({
  priceId: z.string(),
  billingInterval: z.enum(['monthly', 'annual']),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { priceId } = parsed.data
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    let customerId = user.stripeCustomerId

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await createStripeCustomer(user.email, user.name || undefined)
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const session = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      successUrl: `${appUrl}/dashboard?upgraded=true`,
      cancelUrl: `${appUrl}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
