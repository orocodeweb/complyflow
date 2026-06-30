import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Redirect to onboarding if not completed
  if (user.business && !user.business.onboardingComplete) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
        }}
      />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
        {/* Legal footer */}
        <footer className="border-t border-gray-100 py-4 px-6 lg:px-8 mt-8">
          <p className="text-xs text-gray-400 text-center max-w-4xl mx-auto">
            ComplyFlow is a software platform that provides business organization tools, templates, and compliance tracking.
            We are not affiliated with any government agency and do not provide legal, tax, or accounting advice.
          </p>
        </footer>
      </main>
    </div>
  )
}
