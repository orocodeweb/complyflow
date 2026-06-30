import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Up to 3 compliance deadlines',
      '100MB document storage',
      'Basic compliance calendar',
      'Email reminders',
    ],
    limits: {
      deadlines: 3,
      storageGB: 0.1,
      documents: 10,
    },
  },
  STARTER: {
    name: 'Starter',
    monthlyPrice: 19,
    annualPrice: 15, // per month billed annually
    priceIds: {
      monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
      annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
    },
    features: [
      'Unlimited compliance deadlines',
      '5GB document storage',
      'Full compliance calendar',
      'Email & SMS reminders',
      'AI assistant',
      'Compliance score',
    ],
    limits: {
      deadlines: -1, // unlimited
      storageGB: 5,
      documents: 500,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    monthlyPrice: 49,
    annualPrice: 39,
    priceIds: {
      monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID!,
      annual: process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID!,
    },
    features: [
      'Everything in Starter',
      '25GB document storage',
      'Document expiration tracking',
      'Priority email support',
      'Advanced compliance reporting',
      'Custom deadline categories',
    ],
    limits: {
      deadlines: -1,
      storageGB: 25,
      documents: -1,
    },
  },
  BUSINESS: {
    name: 'Business',
    monthlyPrice: 99,
    annualPrice: 79,
    priceIds: {
      monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID!,
      annual: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID!,
    },
    features: [
      'Everything in Professional',
      '100GB document storage',
      'Multiple business profiles',
      'Dedicated support',
      'API access (coming soon)',
      'Team collaboration (coming soon)',
    ],
    limits: {
      deadlines: -1,
      storageGB: 100,
      documents: -1,
    },
  },
} as const

export async function createStripeCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      source: 'complyflow',
    },
  })
}

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string
  priceId: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  })
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export function constructWebhookEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
