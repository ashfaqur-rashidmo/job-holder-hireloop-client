import { authClient } from "@/lib/auth-client"

/**
 * Client-side authenticated fetch.
 *
 * `lib/core/server.ts` has the server version of this function, but it
 * imports `next/headers` and can only be used from Server Components.
 * The application fetchers in `lib/actions/applications.ts` are called
 * from "use client" pages, so they use this variant instead: it reads
 * the better-auth session token in the browser and sends it as a
 * Bearer header to the Express backend.
 */
export const authFetch = async (api: string): Promise<Response> => {
  const { data } = await authClient.getSession()
  const token = data?.session?.token

  return fetch(api, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}
