export type UserRole = 'USER' | 'ADMIN'
export type SubscriptionStatus = 'FREE' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'PAUSED'
export type PricingPlan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'BUSINESS'
export type BusinessType = 'LLC' | 'SOLE_PROPRIETORSHIP' | 'S_CORP' | 'C_CORP' | 'PARTNERSHIP' | 'NONPROFIT' | 'OTHER'
export type DocumentFolder = 'LEGAL' | 'TAX' | 'CONTRACTS' | 'INSURANCE' | 'GOVERNMENT' | 'OTHER'
export type DeadlineCategory = 'ANNUAL_REPORT' | 'TAX_FILING' | 'LICENSE_RENEWAL' | 'INSURANCE' | 'CONTRACT' | 'GOVERNMENT' | 'INTERNAL' | 'OTHER'
export type NotificationType = 'DEADLINE' | 'DOCUMENT' | 'SUBSCRIPTION' | 'SYSTEM' | 'SUPPORT'

export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: UserRole
  subscriptionStatus: SubscriptionStatus
  subscriptionPlan: PricingPlan
  trialEndsAt: string | null
  subscriptionEndsAt: string | null
  business?: Business | null
  createdAt: string
}

export interface Business {
  id: string
  userId: string
  name: string
  type: BusinessType
  state: string
  industry: string
  formationDate: string | null
  employeeCount: string
  filingFrequency: string
  ein: string | null
  website: string | null
  phone: string | null
  address: string | null
  complianceScore: number
  onboardingComplete: boolean
}

export interface Document {
  id: string
  userId: string
  name: string
  originalName: string
  size: number
  mimeType: string
  url: string
  folder: DocumentFolder
  tags: string[]
  expiresAt: string | null
  createdAt: string
}

export interface Deadline {
  id: string
  userId: string
  title: string
  description: string | null
  dueDate: string
  category: DeadlineCategory
  recurring: boolean
  recurrencePattern: string | null
  completed: boolean
  completedAt: string | null
  reminderDays: number[]
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  actionUrl: string | null
  createdAt: string
}

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sessionId: string
  createdAt: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
