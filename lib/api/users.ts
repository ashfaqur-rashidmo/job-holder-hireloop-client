import type { UserRole } from "@/lib/user"

// Browser-safe user API helpers (no server-only imports here —
// server-side user helpers live in lib/api/users.server.ts).

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getUserPremium = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/users/${userId}/premium`)
  if (!response.ok) {
    throw new Error(`Premium check failed (${response.status})`)
  }
  return response.json()
}

// Resilient premium check: true only when the backend confirms it,
// false on any failure (limits apply to free users).
export const isUserPremium = async (userId: string): Promise<boolean> => {
  try {
    const data = await getUserPremium(userId)
    return data?.result?.premium === true
  } catch {
    return false
  }
}

// Update a user's role (admin action). The backend returns a MongoDB
// UpdateResult; we normalize it to a simple success shape.
export const UpdateUserRole = async (
  userId: string,
  role: UserRole
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  })

  const data = (await response.json().catch(() => null)) as {
    matchedCount?: number
    message?: string
  } | null

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || "Failed to update the user role.",
    }
  }

  if (!data || data.matchedCount === 0) {
    return {
      success: false,
      message: "User not found.",
    }
  }

  return {
    success: true,
    message: "Role updated.",
  }
}
