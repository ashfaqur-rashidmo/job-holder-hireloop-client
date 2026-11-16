"use client"

import * as React from "react"
import Image from "next/image"
import { FileText, Upload } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

// The settings page is split in two: this small wrapper waits for the
// session, then renders the real form below with the user's values as
// the initial state (no loading effects needed).
export function SettingsView() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending || !session?.user) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-muted-foreground">Loading settings…</p>
      </div>
    )
  }

  const user = session.user as {
    id: string
    name: string
    email: string
    image?: string | null
    headline?: string | null
    bio?: string | null
    skills?: string | null
  }

  return <SettingsForm key={user.id} user={user} />
}

type SettingsFormProps = {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
    headline?: string | null
    bio?: string | null
    skills?: string | null
  }
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB, matches the hint text

function SettingsForm({ user }: SettingsFormProps) {
  // --- Profile information state -------------------------------------------
  const [fullName, setFullName] = React.useState(user.name)
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [savingProfile, setSavingProfile] = React.useState(false)

  // --- Professional details state ------------------------------------------
  const [headline, setHeadline] = React.useState(user.headline ?? "")
  const [bio, setBio] = React.useState(user.bio ?? "")
  // Skills are stored as one comma-separated string, but edited as chips.
  const [skills, setSkills] = React.useState<string[]>(
    (user.skills ?? "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
  )
  const [skillDraft, setSkillDraft] = React.useState("")
  const [savingDetails, setSavingDetails] = React.useState(false)

  // --- Resume state (upload not implemented yet — see handler below) -------
  const [resumeFile, setResumeFile] = React.useState<File | null>(null)

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"

  // --- Profile information handlers ----------------------------------------

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = "" // allow picking the same file again later

    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a JPG, GIF or PNG image.")
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image is larger than 5MB.")
      return
    }

    setAvatarFile(file)
  }

  /** Reads a file into a data URL so better-auth can store it as `image`. */
  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  async function handleUpdateProfile() {
    if (savingProfile) return
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty.")
      return
    }

    setSavingProfile(true)

    try {
      // A chosen avatar is stored as a data URL in better-auth's native
      // `image` field — navbar and sidebar already display that field.
      let image: string | undefined
      if (avatarFile) {
        image = await readFileAsDataUrl(avatarFile)
      }

      const result = await authClient.updateUser({
        name: fullName.trim(),
        ...(image ? { image } : {}),
      })

      if (result.error) {
        toast.error(result.error.message ?? "Failed to update profile.")
        return
      }

      toast.success("Profile updated")
      setAvatarFile(null)
    } catch {
      toast.error("Failed to update profile.")
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleResetPassword() {
    // Sends the reset link to the account's email (better-auth built-in).
    const result = await authClient.requestPasswordReset({
      email: user.email,
    })

    if (result.error) {
      toast.error("Could not send a password reset email.")
      return
    }

    toast.success("Password reset email sent", {
      description: `Check ${user.email} for the reset link.`,
    })
  }

  // --- Professional details handlers ---------------------------------------

  function addSkill() {
    const value = skillDraft.trim()

    if (value && !skills.includes(value)) {
      setSkills([...skills, value])
    }

    setSkillDraft("")
  }

  function handleSkillKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addSkill()
    }
  }

  async function handleSaveDetails() {
    if (savingDetails) return

    setSavingDetails(true)

    try {
      const result = await authClient.updateUser({
        headline: headline.trim(),
        bio: bio.trim(),
        skills: skills.join(","),
      })

      if (result.error) {
        toast.error(result.error.message ?? "Failed to save details.")
        return
      }

      toast.success("Details saved")
    } catch {
      toast.error("Failed to save details.")
    } finally {
      setSavingDetails(false)
    }
  }

  // --- Resume handler --------------------------------------------------------

  function handleResumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""

    if (!file) return

    // TODO: implement the actual resume upload here (send the file to a
    // storage service / backend and remember the returned URL). For now the
    // chosen file is only kept in local state for the preview card.
    setResumeFile(file)
    toast.info("Resume upload is not wired up yet — file selected locally.")
  }

  // --- Render ---------------------------------------------------------------

  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user.image || "/images/avatar-placeholder.svg"

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details and professional profile.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Profile information */}
          <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-xs">
            <h2 className="text-base font-semibold">Profile Information</h2>

            <div className="mt-5 flex items-center gap-4">
              <Image
                src={avatarPreview}
                alt={user.name || "Avatar"}
                width={64}
                height={64}
                unoptimized
                className="size-16 rounded-full border border-white/10 object-cover"
              />
              <div>
                <label
                  htmlFor="avatar"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
                >
                  {avatarFile ? "Avatar ready — Update Profile to save" : "Change Avatar"}
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-xs text-muted-foreground">
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClass}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs text-muted-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  value={user.email}
                  readOnly
                  disabled
                  title="Changing the email needs a verified flow — not set up yet."
                  className={`${inputClass} cursor-not-allowed opacity-50`}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={savingProfile}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50"
              >
                {savingProfile ? "Updating…" : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                Reset Password
              </button>
            </div>
          </section>

          {/* Professional details */}
          <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-xs">
            <h2 className="text-base font-semibold">Professional Details</h2>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="headline" className="mb-1.5 block text-xs text-muted-foreground">
                  Professional Headline
                </label>
                <input
                  id="headline"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  className={inputClass}
                  placeholder="Senior UX/UI Designer"
                />
              </div>

              <div>
                <label htmlFor="bio" className="mb-1.5 block text-xs text-muted-foreground">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows={4}
                  className={inputClass}
                  placeholder="Passionate designer with 5+ years of experience…"
                />
              </div>

              <div>
                <label htmlFor="skills" className="mb-1.5 block text-xs text-muted-foreground">
                  Skills
                </label>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-[#111111] px-3 py-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white/80"
                    >
                      {skill}
                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() =>
                          setSkills(skills.filter((s) => s !== skill))
                        }
                        className="text-white/40 transition-colors hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    id="skills"
                    value={skillDraft}
                    onChange={(event) => setSkillDraft(event.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={addSkill}
                    className="min-w-[120px] flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                    placeholder="Add a skill…"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Press Enter or comma to add a skill.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSaveDetails}
                disabled={savingDetails}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50"
              >
                {savingDetails ? "Saving…" : "Save Details"}
              </button>
            </div>
          </section>
        </div>

        {/* Right column — resume */}
        <aside>
          <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-xs">
            <h2 className="text-base font-semibold">Resume</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Upload your most recent resume to enable one-click applications.
            </p>

            <div className="mt-5 rounded-xl border border-dashed border-white/15 p-6 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-white/[0.06]">
                {resumeFile ? (
                  <FileText className="size-5 text-indigo-400" aria-hidden="true" />
                ) : (
                  <Upload className="size-5 text-white/40" aria-hidden="true" />
                )}
              </span>

              <p className="mt-3 truncate text-sm text-white">
                {resumeFile ? resumeFile.name : "No resume uploaded"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {resumeFile
                  ? `${(resumeFile.size / (1024 * 1024)).toFixed(1)} MB`
                  : "PDF or DOC, up to 5MB"}
              </p>

              <div className="mt-4 flex justify-center gap-3">
                <label
                  htmlFor="resume"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  {resumeFile ? "Replace" : "Upload"}
                </label>
                {resumeFile && (
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
