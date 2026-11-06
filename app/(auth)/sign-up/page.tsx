"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type SignUpData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: "seeker" | "recruiter" | "admin"
}

type RoleOption = {
  value: "seeker" | "recruiter" | "admin"
  label: string
  description: string
  icon: React.ElementType
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Looking for a job",
    icon: Briefcase,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Hiring talent",
    icon: Building2,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Platform administrator",
    icon: Shield,
  },
]

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<"seeker" | "recruiter" | "admin">("seeker")

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
      role,
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
        role: collected.role,
      } as never)
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <User className="size-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Join HireLoop and start finding your dream role today.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-lg">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive/90">
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
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-600"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Jane Doe"
                  required
                  className="h-10 border border-white/10 bg-[#050505] pl-10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-600"
                  aria-hidden="true"
                />
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  required
                  className="h-10 border border-white/10 bg-[#050505] pl-10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Account type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const isSelected = role === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`size-5 ${isSelected ? "text-indigo-400" : "text-gray-500"}`}
                      />
                      <span className="text-xs font-medium">
                        {option.label}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {option.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-600"
                  aria-hidden="true"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="h-10 border border-white/10 bg-[#050505] pr-10 pl-10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
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
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                  className="h-10 border border-white/10 bg-[#050505] pr-10 pl-10 placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
