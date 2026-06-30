export const metadata = { title: 'Disclaimer' }

export default function DisclaimerPage() {
  return (
    <>
      <h1>Disclaimer</h1>
      <p className="text-sm text-gray-400">Last updated: June 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose mb-6">
        <p className="text-sm text-amber-800 font-medium">
          ComplyFlow is a software platform that provides business organization tools, templates, and compliance
          tracking. We are not affiliated with any government agency and do not provide legal, tax, or accounting
          advice.
        </p>
      </div>

      <h2>No Legal Advice</h2>
      <p>
        ComplyFlow is not a law firm and does not provide legal advice or representation. Information provided
        through the Service, including compliance calendars, checklists, and the AI Assistant, is for general
        informational purposes only and should not be relied upon as legal advice. Compliance requirements vary by
        state, industry, and business structure, and laws change frequently. You should consult a licensed attorney
        for advice specific to your situation.
      </p>

      <h2>No Tax or Accounting Advice</h2>
      <p>
        ComplyFlow is not a CPA firm and does not provide tax preparation, accounting, or financial advisory
        services. Tax deadline reminders provided through the Service are general in nature and may not reflect
        your specific tax obligations. Consult a licensed CPA or tax professional for guidance on your tax
        situation.
      </p>

      <h2>No Government Affiliation</h2>
      <p>
        ComplyFlow is not affiliated with, endorsed by, or connected to any federal, state, or local government
        agency. We do not file documents on your behalf with the Secretary of State, IRS, or any other government
        body, and we do not guarantee any government approval, filing acceptance, or outcome.
      </p>

      <h2>No Guarantee of Accuracy</h2>
      <p>
        While we strive to provide useful and current compliance information, deadlines and requirements displayed
        in the Service are general templates and reminders. They may not reflect every requirement applicable to
        your specific business, state, or industry. You are solely responsible for verifying compliance
        requirements with the appropriate government agency or a qualified professional.
      </p>

      <h2>AI Assistant Disclaimer</h2>
      <p>
        The AI Assistant feature uses artificial intelligence to generate responses based on general knowledge. It
        does not provide legal, tax, or financial advice, may produce inaccurate or incomplete information, and
        should not be relied upon as a substitute for professional consultation.
      </p>

      <h2>Your Responsibility</h2>
      <p>
        You are responsible for independently verifying all compliance deadlines, filing requirements, and
        documentation needs for your business. Use of ComplyFlow does not relieve you of your legal obligations as
        a business owner.
      </p>
    </>
  )
}
