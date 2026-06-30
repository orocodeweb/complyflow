"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, FileText, MessageSquare,
  Settings, Shield, Bell, LogOut, ChevronRight,
  CheckCircle, Users, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: {
    name: string | null
    email: string
    role: string
    subscriptionPlan: string
  }
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/compliance', label: 'Compliance', icon: Shield },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/ai-assistant', label: 'AI Assistant', icon: MessageSquare, paid: true },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminItems = [
  { href: '/admin', label: 'Admin Overview', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const planColors: Record<string, string> = {
    FREE: 'text-gray-500',
    STARTER: 'text-blue-600',
    PROFESSIONAL: 'text-purple-600',
    BUSINESS: 'text-emerald-600',
  }

  return (
    <aside className="w-60 min-h-screen bg-[#1E3A5F] text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-[#1E3A5F]" />
          </div>
          <span className="font-bold text-lg">ComplyFlow</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.paid && user.subscriptionPlan === 'FREE' && (
                <span className="text-[10px] bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                  PRO
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
            </Link>
          )
        })}

        {user.role === 'ADMIN' && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs text-blue-300 font-medium px-3 uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium">
              {(user.name || user.email)[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name || 'Account'}</p>
            <p className="text-xs text-blue-200 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded bg-white/10", planColors[user.subscriptionPlan] || 'text-gray-300')}>
            {user.subscriptionPlan}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
