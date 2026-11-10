"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Menu, X, LogOut } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "@/lib/auth-client"



export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const { data: session } = useSession()

  const NAV_LINKS = [
  { href: "/browse-jobs", label: "Browse Jobs" },
  { href: "/company", label: "Company" },
  { href: "/pricing", label: "Pricing" },
  { href: `/dashboard/${session?.user?.role || "seeker"}`, label: "Dashboard" },
]

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
  }

  const userName = session?.user?.name || session?.user?.email
  const isAuthenticated = !!session

  // The dashboard renders its own sidebar shell.
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <>
      <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]">
        <div className="flex h-12 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5">
              <Image
                src="/images/logo.png"
                alt="Hireloop Logo"
                width={154}
                height={44}
              />
            </Link>
          </div>

          {/* Nav links — always visible */}
          <div className="hidden items-center gap-8 text-sm font-medium text-white lg:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-gray-300"
              >
                {item.label}
              </Link>
            ))}
            <Separator
              orientation="vertical"
              className="mx-2 border-white/20"
            />

            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-gray-300">
                  Welcome, {userName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-indigo-400 hover:bg-white/5 hover:text-indigo-300"
                >
                  <LogOut className="mr-1 size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gradient"
              size="lg"
              className="hidden rounded-full px-6 md:inline-flex"
            >
              {isAuthenticated ? "Post a Job" : "Get Started"}
            </Button>

            {/* Mobile menu toggle — must live inside the bar so it isn't covered */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center rounded-md p-2 text-white focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[85vw] flex-col border-r border-white/10 bg-[#0a0a0a] shadow-2xl sm:max-w-[640px]">
            <div className="flex h-12 items-center justify-between px-6">
              <Link href="/" className="flex items-center gap-1.5">
                <Image
                  src="/images/logo.png"
                  alt="Hireloop Logo"
                  width={154}
                  height={44}
                />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-white focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-4 p-6">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-white transition-colors hover:text-gray-300"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="my-4 flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="text-sm font-medium text-gray-300">
                    Welcome, {userName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-indigo-400 hover:bg-white/5 hover:text-indigo-300"
                  >
                    <LogOut className="mr-1 size-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Sign In
                </Link>
              )}
            </nav>
            <div className="flex gap-3 p-6">
              <Button
                variant="gradient"
                size="lg"
                className="w-full rounded-full px-6"
                onClick={() => setOpen(false)}
              >
                {isAuthenticated ? "Post a Job" : "Get Started"}
              </Button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
