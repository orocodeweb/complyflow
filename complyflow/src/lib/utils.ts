import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  return format(new Date(date), fmt)
}

export function formatDateRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function isDeadlineUrgent(dueDate: string | Date) {
  const due = new Date(dueDate)
  const sevenDaysFromNow = addDays(new Date(), 7)
  return isBefore(due, sevenDaysFromNow) && isAfter(due, new Date())
}

export function isDeadlineOverdue(dueDate: string | Date) {
  return isBefore(new Date(dueDate), new Date())
}

export function getDaysUntilDue(dueDate: string | Date) {
  const due = new Date(dueDate)
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getComplianceScoreColor(score: number) {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getComplianceScoreLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Needs Attention'
  return 'At Risk'
}

export function calculateComplianceScore(data: {
  totalDeadlines: number
  completedDeadlines: number
  overdueDeadlines: number
  documentCount: number
  hasProfile: boolean
}) {
  let score = 0
  if (data.hasProfile) score += 20

  if (data.totalDeadlines > 0) {
    const completionRate = data.completedDeadlines / data.totalDeadlines
    score += Math.round(completionRate * 50)
    score -= Math.min(data.overdueDeadlines * 10, 30)
  } else {
    score += 30
  }

  if (data.documentCount >= 5) score += 20
  else if (data.documentCount >= 1) score += 10

  return Math.max(0, Math.min(100, score))
}

export function truncate(str: string, length = 50) {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
]

export const INDUSTRIES = [
  'Consulting & Professional Services',
  'E-commerce & Retail',
  'Real Estate',
  'Technology & Software',
  'Healthcare & Wellness',
  'Food & Beverage',
  'Construction & Contracting',
  'Marketing & Advertising',
  'Finance & Insurance',
  'Legal Services',
  'Education & Training',
  'Transportation & Logistics',
  'Manufacturing',
  'Media & Entertainment',
  'Non-profit',
  'Other',
]
