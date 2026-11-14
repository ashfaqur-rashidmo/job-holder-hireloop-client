export const USER_ROLES = ["seeker", "recruiter", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

/** One registered platform user, as shown in the admin users table. */
export type PlatformUser = {
  id: string
  name: string
  email: string
  role: UserRole | null
  premium?: boolean
  emailVerified?: boolean
  createdAt: string
}
