"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type SignUpData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const form = event.currentTarget
    const data = new FormData(form)

    const collected: SignUpData = {
      fullName: data.get("fullName") as string,
      email: data.get("email") as string,
      password: data.get("password") as string,
      confirmPassword: data.get("confirmPassword") as string,
    }

    if (collected.password !== collected.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      await authClient.signUp.email({
        email: collected.email,
        password: collected.password,
        name: collected.fullName,
        callbackURL: "/",
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create account"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mb-4">
            <User className="size-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Join HireLoop and start finding your dream role today.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-lg">
          {error && (
            <div
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive/90"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Full name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Jane Doe"
                  required
                  className="pl-10 h-10 bg-[#050505] border border-white/10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600"
                  aria-hidden="true"
                />
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
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600"
                  aria-hidden="true"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="pl-10 pr-10 h-10 bg-[#050505] border border-white/10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 h-10 bg-[#050505] border border-white/10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
