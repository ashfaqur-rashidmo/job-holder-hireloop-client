import Image from "next/image"
import { Briefcase, MapPin, Search, Users, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const TRENDING_ROLES = [
  "Product Designer",
  "AI Engineering",
  "DevOps Engineer",
  "Software Engineer",
  "Data Scientist",
]

const STATS = [
  { value: "50,000+", label: "new jobs this month", icon: Briefcase },
  { value: "15,000+", label: "job seekers assisted", icon: Users },
  { value: "1,000+", label: "top companies hiring", icon: Award },
]

export default function HeroSection() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Decorative gradient glows (pure CSS, no animation library) */}
      <div className="pointer-events-none absolute top-[-10%] left-[10%] h-[600px] w-[600px] rounded-full bg-[#6246EA]/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-[10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="mb-10 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-bold tracking-wider text-indigo-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            50,000+ new jobs this month
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto mb-6 max-w-4xl text-5xl leading-tight font-bold tracking-tight text-white sm:text-7xl">
          Find Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dream Job
          </span>{" "}
          Today
        </h1>

        {/* Description */}
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <div className="mx-auto mb-16 max-w-[760px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full min-w-0 flex-1 sm:w-auto">
              <div className="relative w-full">
                <Briefcase
                  className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Job title, skill or company"
                  aria-label="Job title, skill or company"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0a] pl-12 text-white transition-all placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex w-full min-w-0 flex-1 gap-3 sm:mx-0 sm:w-auto">
              <div className="relative min-w-0 flex-1">
                <MapPin
                  className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Location or Remote"
                  aria-label="Location or Remote"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0a] pl-12 text-white transition-all placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="h-11 shrink-0 rounded-xl px-8"
              >
                <Search className="mr-2 size-5" aria-hidden="true" />
                Search jobs
              </Button>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            Try searching for &quot;product designer&quot;, &quot;remote&quot;,
            or &quot;New York&quot;
          </p>
        </div>

        {/* Trending roles */}
        <div className="mx-auto mb-16 max-w-[760px]">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-2 text-[11px] font-medium text-gray-500">
              Trending positions
            </span>
            {TRENDING_ROLES.map((role) => (
              <Button
                key={role}
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-white/10 bg-white/[0.04] px-4 text-[12px] font-normal text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-8 border-t border-white/10 pt-12 sm:flex-nowrap sm:gap-16">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.value} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-indigo-400">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call-to-action card */}
        <div className="mx-auto mt-20 max-w-[760px] rounded-2xl border border-white/10 bg-[#0a0a0a]/40 p-8 backdrop-blur-sm sm:p-12">
          <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 sm:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to hire top talent?
              </h2>
              <p className="mt-3 text-gray-400 sm:mt-4">
                Post a job in minutes and reach thousands of qualified
                candidates.
              </p>
            </div>
            <div className="flex flex-col items-center justify-end sm:items-end">
              <Button
                variant="gradient"
                size="lg"
                className="w-full rounded-xl px-10 sm:w-auto"
              >
                Post a job <span className="ml-2">→</span>
              </Button>
              <p className="mt-4 text-xs text-gray-600">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Globe decorative section */}
      <section className="relative mt-20 h-[520px] w-full overflow-hidden sm:mt-28 sm:h-[640px]">
        <div className="absolute inset-0 bg-[#0a0a0a]/60 [mask-image:radial-gradient(circle,white_60%,transparent_100%)]" />
        <div className="pointer-events-none absolute bottom-[-12%] left-1/2 w-[1400px] max-w-none -translate-x-1/2 opacity-40">
          <Image
            src="/images/globe.png"
            alt="Glowing Earth globe"
            width={1400}
            height={700}
            priority
            className="h-auto w-full object-contain drop-shadow-[0_0_80px_rgba(99,70,230,0.45)]"
          />
        </div>
        <div className="absolute bottom-[18%] left-1/2 z-10 w-full -translate-x-1/2 px-4 text-center sm:bottom-[20%] sm:px-0 sm:text-left">
          <div className="mx-auto max-w-2xl sm:mx-0 sm:ml-0">
            <p className="text-lg leading-snug font-medium tracking-tight text-white/90 sm:text-2xl md:text-3xl">
              Assisting over <span className="text-indigo-400">15,000</span> job
              seekers <br />
              find their dream positions.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
