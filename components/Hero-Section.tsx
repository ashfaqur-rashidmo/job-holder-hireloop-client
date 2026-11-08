import Image from "next/image"
import { Briefcase, MapPin, Search, Star, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const TRENDING_ROLES = ["Product Designer", "AI Engineering", "DevOps Engineer"]

const STATS = [
  { value: "50K", label: "Active Jobs", icon: Briefcase },
  { value: "12K", label: "Companies", icon: Building2 },
  { value: "2M", label: "Job Seekers", icon: Search },
  { value: "97%", label: "Satisfaction Rate", icon: Star },
]

export default function HeroSection() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Decorative gradient glows */}
      <div className="pointer-events-none absolute top-[-10%] left-[10%] h-[600px] w-[600px] rounded-full bg-[#6246EA]/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-[10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Globe + stars backdrop anchored to the bottom of the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1882}
          priority
          className="absolute bottom-[-180px] left-1/2 h-auto w-[720px] max-w-none -translate-x-1/2 object-contain select-none sm:bottom-[-240px] sm:w-[900px] lg:bottom-[-340px] lg:w-[1200px]"
        />
        {/* subtle fade so the stat cards stay legible over the globe */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 text-center sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="mb-10 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-bold tracking-wider text-indigo-300 backdrop-blur-sm">
            <Briefcase className="size-4 text-orange-500" />
            <span>50,000+</span>
            <span className="text-white/70">NEW JOBS THIS MONTH</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto mb-6 max-w-5xl text-center text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Find Your Dream Job Today
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-gray-400 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <div className="mx-auto mb-10 max-w-[760px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full min-w-0 flex-1 sm:w-auto">
              <div className="relative w-full">
                <Search
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
                aria-label="Search jobs"
                className="h-11 shrink-0 rounded-xl px-8"
              >
                <Search className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trending roles */}
        <div className="mx-auto mb-20 max-w-[760px]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="mr-2 text-[10px] font-medium tracking-wider text-gray-500 uppercase">
              Trending Position
            </span>
            {TRENDING_ROLES.map((role) => (
              <Button
                key={role}
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-white/10 bg-white/[0.03] px-3 text-[11px] font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Assisting statement + stat cards, layered over the globe */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 lg:px-8">
        <p className="mx-auto max-w-2xl text-center text-lg leading-snug font-medium tracking-tight text-white/90 sm:text-2xl md:text-3xl">
          Assisting over <span className="text-indigo-400">15,000</span> job
          seekers <br className="hidden sm:block" />
          find their dream positions.
        </p>

        {/* Stat cards */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.value}
                className="flex min-w-[140px] flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-[#0a0a0a]/60 p-4 backdrop-blur-sm sm:min-w-[160px] sm:p-5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-indigo-400">
                  <Icon size={16} aria-hidden="true" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
