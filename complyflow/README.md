# ComplyFlow

A full-stack, subscription-based business compliance SaaS platform for small business owners in the United States. Built with Next.js, Prisma, Stripe, and Supabase.

> ⚠️ **Legal notice:** ComplyFlow is a software and information platform only. It is **not** a law firm, **not** a CPA firm, and **not** a government agency. It does not provide legal, tax, or financial advice and does not guarantee any government approval or filing outcome. See [`/legal/disclaimer`](#) for full details.

## Features

- 🔐 **Authentication** — email/password with secure JWT sessions, password reset flow
- 💳 **Subscription billing** — Stripe Checkout & Customer Portal, monthly/annual plans, 14-day free trial
- 📊 **Compliance dashboard** — calculated compliance score, upcoming/overdue deadlines, notifications
- 📅 **Compliance calendar** — recurring deadlines, reminders, category filters, month view
- 🗂️ **Document vault** — encrypted file storage organized into Legal / Tax / Contracts / Insurance / Government folders
- 🧙 **Onboarding wizard** — business profile setup that seeds a personalized compliance calendar
- 🤖 **AI assistant** — Claude-powered chat for platform help and general business education (with mandatory disclaimers)
- 🔔 **Notifications** — in-app + email reminders via Resend
- 🛠️ **Admin dashboard** — user management, plan breakdown, analytics, support tickets
- 📄 **Full legal page suite** — Terms, Privacy, Disclaimer, Refund Policy, Cookie Policy, E-Consent

## Tech stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Frontend    | Next.js 14 (App Router), React, TypeScript |
| Styling     | Tailwind CSS, Radix UI primitives    |
| Backend     | Next.js API routes                   |
| Database    | PostgreSQL via Prisma ORM (Supabase-compatible) |
| Auth        | Custom JWT + bcrypt (httpOnly cookies) |
| Payments    | Stripe (Checkout + Billing Portal + Webhooks) |
| File storage| Supabase Storage / AWS S3 (pluggable) |
| Email       | Resend                               |
| AI          | Anthropic API                        |
| Hosting     | Vercel                               |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/orocodeweb/complyflow.git
cd complyflow
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

You'll need accounts/keys for:
- A PostgreSQL database (e.g. [Supabase](https://supabase.com))
- [Stripe](https://stripe.com) (test mode is fine for development)
- [Resend](https://resend.com) for transactional email
- [Anthropic](https://console.anthropic.com) for the AI Assistant

### 3. Set up the database

```bash
npm run db:generate
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    api/              # API routes (auth, stripe, documents, compliance, ai, admin...)
    dashboard/         # Main authenticated dashboard
    compliance/        # Deadline tracking
    calendar/          # Calendar view
    documents/         # Document vault
    ai-assistant/       # AI chat
    settings/          # Account & billing settings
    admin/             # Admin views
    legal/             # Terms, Privacy, Disclaimer, etc.
    onboarding/         # Business profile setup wizard
  components/
    ui/                # Reusable UI primitives (button, input, card, toast...)
    layout/            # Sidebar and shell components
  lib/                 # auth, stripe, email, rate-limit, utils
  types/               # Shared TypeScript types
prisma/
  schema.prisma        # Database schema
```

## Stripe setup

1. Create four products in your Stripe dashboard (Starter, Professional, Business) each with monthly and annual recurring prices.
2. Copy the resulting price IDs into your `.env` file.
3. Add a webhook endpoint pointing to `/api/stripe/webhook` listening for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Security notes

- Passwords are hashed with bcrypt (12 rounds)
- Sessions use httpOnly, secure, sameSite cookies
- Basic in-memory rate limiting is included for auth and AI endpoints (swap for Redis/Upstash in production)
- All API routes enforce per-user data isolation (multi-tenant by `userId`)
- Stripe webhook signatures are verified before processing

## Roadmap (structure prepared, not yet built)

- Automated state filing integrations
- Team collaboration / multi-user businesses
- QuickBooks and payroll integrations
- Native mobile app
- AI-powered compliance scoring v2

## License

Proprietary — all rights reserved.
