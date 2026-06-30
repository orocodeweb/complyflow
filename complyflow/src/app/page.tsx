import Link from 'next/link'
import { CheckCircle, Shield, Calendar, FileText, BarChart3, Bell, ArrowRight, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#1E3A5F]">ComplyFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-[#1E3A5F] transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1E3A5F] transition-colors">Pricing</Link>
              <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-[#1E3A5F] transition-colors">How it works</Link>
              <Link href="/legal/terms" className="text-sm text-gray-600 hover:text-[#1E3A5F] transition-colors">Legal</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-[#1E3A5F] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:bg-[#152b46] transition-colors"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#059669] text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5" />
            Trusted by 2,000+ small business owners
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Stop missing business<br />
            <span className="text-[#1E3A5F]">compliance deadlines</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            ComplyFlow helps LLC owners and small business operators track deadlines, organize documents, and stay on top of annual filings — all in one clean dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#152b46] transition-colors text-sm"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-300 transition-colors text-sm"
            >
              View pricing
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Free plan available. No credit card required to start.
          </p>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-y border-amber-100 py-3 px-4">
        <p className="text-center text-xs text-amber-800 max-w-4xl mx-auto">
          <strong>Important:</strong> ComplyFlow is a software and information platform only. We are not a law firm, CPA firm, or government agency. We do not provide legal, tax, or financial advice, and we do not guarantee any government approval or filing outcome.
        </p>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to stay compliant</h2>
            <p className="text-gray-500 max-w-xl mx-auto">One platform to manage your compliance calendar, store important documents, and track your business health score.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#1E3A5F]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Up and running in minutes</h2>
            <p className="text-gray-500">Set up your compliance dashboard in three simple steps.</p>
          </div>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What business owners say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{t.quote}</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1E3A5F]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get organized?</h2>
          <p className="text-blue-200 mb-8">Join thousands of business owners who use ComplyFlow to stay on top of their compliance.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-[#1E3A5F] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Start for free — no credit card required
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#1E3A5F]" />
                </div>
                <span className="text-white font-semibold text-sm">ComplyFlow</span>
              </div>
              <p className="text-xs leading-relaxed">Business compliance tracking software for small business owners in the United States.</p>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-4">Product</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Get started</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-4">Company</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                <li><Link href="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-4">Support</p>
              <ul className="space-y-2 text-xs">
                <li><a href="mailto:support@complyflow.com" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              ComplyFlow is a software platform that provides business organization tools, templates, and compliance tracking. We are not affiliated with any government agency and do not provide legal, tax, or accounting advice. Use of this platform does not constitute an attorney-client relationship or constitute legal advice.
            </p>
            <p className="text-xs text-gray-600 text-center mt-4">
              © {new Date().getFullYear()} ComplyFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Calendar,
    title: 'Compliance Calendar',
    description: 'Track annual reports, license renewals, tax deadlines, and custom business milestones in a single calendar view.',
  },
  {
    icon: FileText,
    title: 'Document Vault',
    description: 'Securely store and organize your legal documents, tax filings, contracts, and insurance policies with encrypted storage.',
  },
  {
    icon: BarChart3,
    title: 'Compliance Score',
    description: 'See your overall compliance health at a glance with a calculated score that updates as you complete tasks.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Get email notifications before deadlines so you never miss an annual report, renewal, or filing date again.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your business data is encrypted at rest and in transit. Multi-tenant architecture ensures complete data isolation.',
  },
  {
    icon: CheckCircle,
    title: 'AI Assistant',
    description: 'Get help understanding platform features, generating checklists, and navigating general business setup questions.',
  },
]

const steps = [
  {
    title: 'Create your account',
    description: 'Sign up with your email in under 60 seconds. No credit card required for the free plan.',
  },
  {
    title: 'Set up your business profile',
    description: 'Tell us about your business type, state, and industry. We use this to populate your compliance calendar with relevant deadlines.',
  },
  {
    title: 'Track, upload, and stay ahead',
    description: 'Your dashboard populates with upcoming deadlines. Upload documents to your vault and let email reminders keep you on track.',
  },
]

const testimonials = [
  {
    quote: 'Finally, a tool that makes me feel in control of my LLC compliance. I set it up in 20 minutes and now I get reminders before every deadline.',
    name: 'Marcus T.',
    role: 'Real estate investor, Texas',
  },
  {
    quote: 'As a freelancer I always worried about missing annual filings. ComplyFlow gives me peace of mind without hiring an expensive lawyer.',
    name: 'Sofia R.',
    role: 'Freelance designer, California',
  },
  {
    quote: 'The document vault alone is worth it. I used to keep everything in a folder on my desktop. Now it\'s all organized and searchable.',
    name: 'James K.',
    role: 'E-commerce seller, Florida',
  },
]
