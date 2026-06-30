export const metadata = { title: 'Refund Policy' }

export default function RefundPage() {
  return (
    <>
      <h1>Refund Policy</h1>
      <p className="text-sm text-gray-400">Last updated: June 2026</p>

      <h2>Free Trial</h2>
      <p>
        Paid subscription plans include a 14-day free trial. You may cancel at any time during the trial period
        without being charged. If you do not cancel before the trial ends, your payment method will be charged the
        applicable subscription fee.
      </p>

      <h2>Monthly Subscriptions</h2>
      <p>
        Monthly subscription fees are billed in advance and are generally non-refundable. If you cancel your
        subscription, you will continue to have access to paid features until the end of your current billing
        period, after which your account will revert to the Free plan.
      </p>

      <h2>Annual Subscriptions</h2>
      <p>
        Annual subscription fees are billed in advance for a 12-month term. If you cancel within 14 days of your
        initial annual purchase, you may request a full refund by contacting support@complyflow.com. After 14 days,
        annual subscriptions are non-refundable, but you will retain access to paid features through the end of
        your paid term.
      </p>

      <h2>Exceptions</h2>
      <p>
        We may issue refunds at our discretion in cases of billing errors, duplicate charges, or extended service
        outages. To request a refund, contact support@complyflow.com with your account email and a description of
        the issue.
      </p>

      <h2>How to Cancel</h2>
      <p>
        You can cancel your subscription at any time from the Billing section of your account settings, which opens
        Stripe's secure customer portal. Canceling stops future billing but does not retroactively refund past
        charges except as described above.
      </p>

      <h2>Contact</h2>
      <p>
        For billing questions or refund requests, email support@complyflow.com.
      </p>
    </>
  )
}
