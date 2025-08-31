export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  status: "active" | "inactive" | "pending"
  lastActive: string
}

export interface BillingPlan {
  name: string
  price: string
  description: string
  features: string[]
  isCurrent: boolean
  recommended?: boolean
}
