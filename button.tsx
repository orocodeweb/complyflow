// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String?
  name              String?
  avatar            String?
  role              Role      @default(USER)
  emailVerified     DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Subscription
  stripeCustomerId  String?   @unique
  subscriptionId    String?   @unique
  subscriptionStatus SubscriptionStatus @default(FREE)
  subscriptionPlan  PricingPlan @default(FREE)
  trialEndsAt       DateTime?
  subscriptionEndsAt DateTime?

  // Relations
  business          Business?
  documents         Document[]
  deadlines         Deadline[]
  notifications     Notification[]
  supportTickets    SupportTicket[]
  aiMessages        AiMessage[]

  @@map("users")
}

model Business {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  name            String
  type            BusinessType
  state           String
  industry        String
  formationDate   DateTime?
  employeeCount   EmployeeCount @default(SOLO)
  filingFrequency FilingFrequency @default(ANNUAL)
  ein             String?
  website         String?
  phone           String?
  address         String?

  complianceScore Int       @default(0)
  onboardingComplete Boolean @default(false)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("businesses")
}

model Document {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  originalName String
  size        Int
  mimeType    String
  url         String
  folder      DocumentFolder @default(OTHER)
  tags        String[]
  expiresAt   DateTime?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("documents")
}

model Deadline {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  title       String
  description String?
  dueDate     DateTime
  category    DeadlineCategory
  recurring   Boolean   @default(false)
  recurrencePattern String?
  completed   Boolean   @default(false)
  completedAt DateTime?
  reminderDays Int[]    @default([7, 1])
  notified    Boolean   @default(false)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("deadlines")
}

model Notification {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  title       String
  message     String
  type        NotificationType
  read        Boolean   @default(false)
  actionUrl   String?

  createdAt   DateTime  @default(now())

  @@map("notifications")
}

model SupportTicket {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  subject     String
  message     String
  status      TicketStatus @default(OPEN)
  priority    TicketPriority @default(NORMAL)
  adminReply  String?
  repliedAt   DateTime?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("support_tickets")
}

model AiMessage {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  role        MessageRole
  content     String
  sessionId   String

  createdAt   DateTime  @default(now())

  @@map("ai_messages")
}

// Enums

enum Role {
  USER
  ADMIN
}

enum SubscriptionStatus {
  FREE
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  PAUSED
}

enum PricingPlan {
  FREE
  STARTER
  PROFESSIONAL
  BUSINESS
}

enum BusinessType {
  LLC
  SOLE_PROPRIETORSHIP
  S_CORP
  C_CORP
  PARTNERSHIP
  NONPROFIT
  OTHER
}

enum EmployeeCount {
  SOLO
  TWO_TO_FIVE
  SIX_TO_TEN
  ELEVEN_TO_FIFTY
  FIFTY_PLUS
}

enum FilingFrequency {
  MONTHLY
  QUARTERLY
  ANNUAL
}

enum DocumentFolder {
  LEGAL
  TAX
  CONTRACTS
  INSURANCE
  GOVERNMENT
  OTHER
}

enum DeadlineCategory {
  ANNUAL_REPORT
  TAX_FILING
  LICENSE_RENEWAL
  INSURANCE
  CONTRACT
  GOVERNMENT
  INTERNAL
  OTHER
}

enum NotificationType {
  DEADLINE
  DOCUMENT
  SUBSCRIPTION
  SYSTEM
  SUPPORT
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum MessageRole {
  USER
  ASSISTANT
}
