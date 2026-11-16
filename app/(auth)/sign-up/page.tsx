"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type SignUpRole = "seeker" | "recruiter"

type SignUpData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: SignUpRole
  image?: string
}

type RoleOption = {
  value: SignUpRole
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
]

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<SignUpRole>("seeker")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [isImageUploading, setIsImageUploading] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  // Runs whenever the user picks a (profile) image file. The actual
  // upload is NOT implemented yet — this only keeps the selected file
  // in state so the upload logic can read it later.
  const handleImageChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0] ?? null

  if (!file) return

  // Validate image type
  if (!file.type.startsWith("image/")) {
    setError("Please choose a valid image file.")
    event.target.value = ""
    setImageFile(null)
    setImageUrl("")
    return
  }

  // Validate file size (maximum 5 MB)
  if (file.size > 5 * 1024 * 1024) {
    setError("Image size must be less than 5 MB.")
    event.target.value = ""
    setImageFile(null)
    setImageUrl("")
    return
  }

  setError(null)
  setImageFile(file)
  setImageUrl("")
  setIsImageUploading(true)

  try {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.")
    }

    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    )

    const result = await response.json()

    if (!response.ok || !result.success || !result.data?.url) {
      throw new Error(
        result.error?.message || "Failed to upload profile image."
      )
    }

    // Save permanent image URL
    setImageUrl(result.data.url)

    console.log("Uploaded image URL:", result.data.url)

    toast.success("Profile image uploaded successfully!")
  } catch (error) {
    console.error("Image upload error:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Image upload failed."

    setError(message)
    setImageUrl("")
    setImageFile(null)
    event.target.value = ""

    toast.error(message)
  } finally {
    setIsImageUploading(false)
  }
}

  useEffect(() => {
    if (!isPending && session) {
      router.push("/")
    }
  }, [session, isPending, router])

  if (isPending) {
    return null
  }

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

    console.log("SignUp form data:", collected)

    if (collected.password !== collected.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

   try {
  const response = await authClient.signUp.email({
    email: collected.email,
    password: collected.password,
    name: collected.fullName,
    callbackURL: "/",
    role: collected.role,
    image: imageUrl || undefined,
  } as never)

  console.log("Signup response:", response)

  if (response.error) {
    const message =
      response.error.message || "Failed to create account."

    setError(message)
    toast.error("Signup failed", {
      description: message,
    })

    return
  }

  toast.success("Account created successfully!", {
    description: `Welcome to HireLoop, ${collected.fullName}`,
  })

  router.push("/")
} catch (err: unknown) {
  console.error("Signup exception:", err)

  const message =
    err instanceof Error ? err.message : "Failed to create account."

  setError(message)
  toast.error("Signup failed", {
    description: message,
  })
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
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-300"
              >
                Profile image <span className="text-gray-500">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="profileImage"
                  className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-white/10 bg-[#050505] px-4 text-sm text-gray-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Choose image
                </label>
                <span className="min-w-0 truncate text-xs text-gray-500">
                  {imageFile ? imageFile.name : "No image selected"}
                </span>
              </div>
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
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
                <Lock
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-600"
                  aria-hidden="true"
                />
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
              disabled={isLoading || isImageUploading}
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
