import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'noreply@complyflow.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://complyflow.com'

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your ComplyFlow password',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="margin-bottom: 24px;">
          <h1 style="color: #1E3A5F; font-size: 24px; font-weight: 700; margin: 0;">ComplyFlow</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px; font-weight: 600;">Reset your password</h2>
        <p style="color: #6B7280; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password.
          This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #1E3A5F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 11px;">
          ComplyFlow is a software platform that provides business organization tools, templates, and compliance tracking.
          We are not affiliated with any government agency and do not provide legal, tax, or accounting advice.
        </p>
      </div>
    `,
  })
}

export async function sendDeadlineReminderEmail(
  email: string,
  deadline: { title: string; dueDate: Date; category: string },
  daysUntilDue: number
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reminder: "${deadline.title}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="margin-bottom: 24px;">
          <h1 style="color: #1E3A5F; font-size: 24px; font-weight: 700; margin: 0;">ComplyFlow</h1>
        </div>
        <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #92400E; font-weight: 600; margin: 0;">⚠️ Upcoming Deadline</p>
        </div>
        <h2 style="color: #111827; font-size: 20px; font-weight: 600;">${deadline.title}</h2>
        <p style="color: #6B7280; line-height: 1.6;">
          This deadline is due in <strong>${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}</strong> on
          <strong>${deadline.dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
        </p>
        <a href="${APP_URL}/calendar" style="display: inline-block; background: #1E3A5F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0;">
          View in ComplyFlow
        </a>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 11px;">
          ComplyFlow is a software platform that provides business organization tools, templates, and compliance tracking.
          We are not affiliated with any government agency and do not provide legal, tax, or accounting advice.
        </p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Welcome to ComplyFlow',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="margin-bottom: 24px;">
          <h1 style="color: #1E3A5F; font-size: 24px; font-weight: 700; margin: 0;">ComplyFlow</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px; font-weight: 600;">Welcome, ${name || 'there'}! 👋</h2>
        <p style="color: #6B7280; line-height: 1.6;">
          Your ComplyFlow account is ready. Set up your business profile to generate your personalized
          compliance calendar and start tracking what matters.
        </p>
        <a href="${APP_URL}/onboarding" style="display: inline-block; background: #1E3A5F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0;">
          Set Up My Business Profile
        </a>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
          <strong>Important:</strong> ComplyFlow is a software and information platform only. We are not a law firm,
          CPA firm, or government agency, and we do not provide legal, tax, or financial advice.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 11px;">
          ComplyFlow is a software platform that provides business organization tools, templates, and compliance tracking.
          We are not affiliated with any government agency and do not provide legal, tax, or accounting advice.
        </p>
      </div>
    `,
  })
}
