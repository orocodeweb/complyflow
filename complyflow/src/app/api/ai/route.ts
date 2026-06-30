import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, prisma } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = `You are ComplyFlow Assistant, a helpful AI built into the ComplyFlow business compliance platform.

IMPORTANT DISCLAIMERS YOU MUST FOLLOW:
- You are NOT a lawyer, CPA, or financial advisor
- You do NOT provide legal, tax, or financial advice
- You do NOT guarantee any government approval or filing outcome
- Always recommend users consult qualified professionals for legal, tax, or financial matters

You CAN help with:
- Explaining how ComplyFlow platform features work
- Answering general questions about common business compliance concepts (what an annual report is, general LLC information, etc.)
- Generating compliance checklists and task lists
- Explaining general business structure differences (LLC vs S-Corp, etc.) in educational terms
- Helping users navigate the ComplyFlow dashboard and features
- Summarizing general compliance steps (always noting to verify with a professional)

Platform features you can explain:
- Compliance Calendar: Track deadlines, set reminders, mark tasks complete
- Document Vault: Upload/organize PDFs, contracts, tax docs in encrypted storage
- Compliance Score: 0-100 metric based on completed tasks and uploaded documents
- AI Assistant (that's you): General platform guidance and educational info
- Notifications: Email reminders for upcoming deadlines
- Business Profile: Setup wizard to personalize the compliance calendar
- Settings/Billing: Manage subscription via Stripe customer portal

Always end responses with: "⚠️ This assistant does not provide legal, tax, or financial advice. Consult a qualified professional for your specific situation."

Be concise, friendly, and practical. Format responses with markdown when helpful.`

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    // Rate limit: 30 messages per hour
    const rl = rateLimit(`ai:${user.id}`, 30, 60 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Message limit reached. Please try again in an hour.' },
        { status: 429 }
      )
    }

    // AI is a paid feature
    if (user.subscriptionPlan === 'FREE' && user.subscriptionStatus === 'FREE') {
      return NextResponse.json(
        { error: 'AI Assistant is available on paid plans. Please upgrade to access this feature.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { message, sessionId, history = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      )
    }

    // Save user message
    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: 'USER',
        content: message,
        sessionId: sessionId || 'default',
      },
    })

    // Call Anthropic API
    const messages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.'

    // Save assistant response
    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: 'ASSISTANT',
        content: reply,
        sessionId: sessionId || 'default',
      },
    })

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI assistant error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || 'default'

    const messages = await prisma.aiMessage.findMany({
      where: { userId: user.id, sessionId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('AI GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
