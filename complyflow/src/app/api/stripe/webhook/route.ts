import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { prisma } from '@/lib/auth'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (!user) break

        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanFromPriceId(priceId)

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionId: subscription.id,
            subscriptionStatus: mapStripeStatus(subscription.status),
            subscriptionPlan: plan,
            subscriptionEndsAt: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
          },
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Subscription updated',
            message: `Your ${plan} plan is now ${subscription.status}.`,
            type: 'SUBSCRIPTION',
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (!user) break

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: 'CANCELED',
            subscriptionPlan: 'FREE',
            subscriptionId: null,
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (!user) break

        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: 'PAST_DUE' },
        })

        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Payment failed',
            message: 'Your last payment failed. Please update your payment method.',
            type: 'SUBSCRIPTION',
            actionUrl: '/settings',
          },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

function getPlanFromPriceId(priceId: string): 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' {
  const env = process.env
  if ([env.STRIPE_STARTER_MONTHLY_PRICE_ID, env.STRIPE_STARTER_ANNUAL_PRICE_ID].includes(priceId)) return 'STARTER'
  if ([env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID, env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID].includes(priceId)) return 'PROFESSIONAL'
  if ([env.STRIPE_BUSINESS_MONTHLY_PRICE_ID, env.STRIPE_BUSINESS_ANNUAL_PRICE_ID].includes(priceId)) return 'BUSINESS'
  return 'FREE'
}

function mapStripeStatus(status: string): 'FREE' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'PAUSED' {
  const map: Record<string, 'FREE' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'PAUSED'> = {
    trialing: 'TRIALING',
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    unpaid: 'PAST_DUE',
    paused: 'PAUSED',
  }
  return map[status] || 'FREE'
}
