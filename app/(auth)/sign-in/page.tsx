"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type SignInData = {
  email: string
  password: string
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError("")

    const form = event.currentTarget
    const data = new FormData(form)

    const collected: SignInData = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    }

    setIsLoading(true)

    try {
      await authClient.signIn.email({
        email: collected.email,
        password: collected.password,
        callbackURL: "/",
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to sign in"

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-4 py-12">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mb-4">
            <User className="size-5 text-indigo-400" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Welcome back. Enter your credentials to continue.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-lg">

          <form onSubmit={handleSignIn} className="space-y-4" noValidate>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />

                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 h-10 bg-[#050505] border border-white/10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />

                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 h-10 bg-[#050505] border border-white/10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded bg-[#050505] border border-white/10 text-indigo-500 focus:ring-indigo-500"
                />
                Remember me
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
