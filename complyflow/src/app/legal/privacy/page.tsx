export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-400">Last updated: June 2026</p>

      <p>
        This Privacy Policy describes how ComplyFlow ("we," "us," "our") collects, uses, and protects information
        when you use our website and Service.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following categories of information:</p>
      <ul>
        <li><strong>Account information:</strong> name, email address, and password (stored as a secure hash).</li>
        <li><strong>Business profile information:</strong> business name, type, state, industry, formation date, and related details you provide.</li>
        <li><strong>Documents:</strong> files you upload to the Document Vault.</li>
        <li><strong>Payment information:</strong> processed and stored by Stripe; we do not store full credit card numbers.</li>
        <li><strong>Usage data:</strong> log data, device information, and interactions with the Service.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Generate your personalized compliance calendar</li>
        <li>Send deadline reminders and account-related notifications via email (and SMS, if enabled)</li>
        <li>Process subscription payments</li>
        <li>Respond to support requests</li>
        <li>Detect and prevent fraud or abuse</li>
      </ul>

      <h2>3. Data Storage and Security</h2>
      <p>
        Documents and personal data are encrypted at rest and in transit. We implement role-based access controls
        and multi-tenant data isolation so that your business data is not accessible to other users. Despite these
        measures, no system is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>4. Data Sharing</h2>
      <p>We do not sell your personal information. We may share information with:</p>
      <ul>
        <li>Service providers who help us operate the platform (e.g., Stripe for payments, Resend/SendGrid for email, Supabase/AWS for storage)</li>
        <li>Law enforcement or regulators when required by law</li>
        <li>A successor entity in the event of a merger, acquisition, or sale of assets</li>
      </ul>

      <h2>5. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, or export your personal data.
        You can manage most of your information directly in your account settings or by contacting
        support@complyflow.com.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active or as needed to provide the Service. If you
        delete your account, we will delete or anonymize your personal data within a reasonable period, except
        where retention is required by law.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        The Service is not directed to individuals under 18, and we do not knowingly collect personal information
        from children.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. We will notify you of material changes via email or through
        the Service.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        For privacy-related questions, contact us at privacy@complyflow.com.
      </p>
    </>
  )
}
