import { headers } from "next/headers"

import { auth } from "@/lib/auth"

/**
 * Server-only helpers. This file imports `next/headers`, so it can only
 * be used from Server Components / API routes — never from the browser.
 */

/** All registered users, loaded through the better-auth admin API. */
export const getUsers = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name", // The field to sort by.
      sortDirection: "desc", // The direction to sort by.
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  })

  return users
}
