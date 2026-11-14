import { headers } from "next/headers"
import { auth } from "../auth"

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




export const getUsers = async () => {
   const users = await auth.api.listUsers({
    query: {
      
        sortBy: "name", // The field to sort by.
        sortDirection: "desc", // The direction to sort by.
       
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});

  return users
}