import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1E3A5F]">ComplyFlow</span>
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex gap-6 mb-8 text-sm border-b border-gray-100 pb-4 flex-wrap">
          <Link href="/legal/terms" className="text-gray-500 hover:text-[#1E3A5F]">Terms of Service</Link>
          <Link href="/legal/privacy" className="text-gray-500 hover:text-[#1E3A5F]">Privacy Policy</Link>
          <Link href="/legal/disclaimer" className="text-gray-500 hover:text-[#1E3A5F]">Disclaimer</Link>
          <Link href="/legal/refund" className="text-gray-500 hover:text-[#1E3A5F]">Refund Policy</Link>
          <Link href="/legal/cookies" className="text-gray-500 hover:text-[#1E3A5F]">Cookie Policy</Link>
          <Link href="/legal/econsent" className="text-gray-500 hover:text-[#1E3A5F]">E-Consent</Link>
        </div>
        <article className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
          {children}
        </article>
      </div>
    </div>
  )
}
