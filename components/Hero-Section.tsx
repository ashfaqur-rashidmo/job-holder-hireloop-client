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
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-[#6246EA]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24">

        {/* Top badge */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-bold tracking-wider text-indigo-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            50,000+ new jobs this month
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-tight">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Dream Job
          </span>{" "}
          Today
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg text-gray-400 leading-relaxed mb-12 sm:text-xl">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <div className="mx-auto max-w-[760px] mb-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full flex-1 min-w-0 sm:w-auto">
              <div className="relative w-full">
                <Briefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Job title, skill or company"
                  aria-label="Job title, skill or company"
                  className="pl-12 h-11 w-full bg-[#0a0a0a] border border-white/10 rounded-xl placeholder:text-gray-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="flex w-full flex-1 min-w-0 gap-3 sm:w-auto sm:mx-0">
              <div className="relative flex-1 min-w-0">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Location or Remote"
                  aria-label="Location or Remote"
                  className="pl-12 h-11 w-full bg-[#0a0a0a] border border-white/10 rounded-xl placeholder:text-gray-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="shrink-0 h-11 rounded-xl px-8"
              >
                <Search className="size-5 mr-2" aria-hidden="true" />
                Search jobs
              </Button>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            Try searching for "product designer", "remote", or "New York"
          </p>
        </div>

        {/* Trending roles */}
        <div className="mx-auto max-w-[760px] mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-2 text-[11px] font-medium text-gray-500">
              Trending positions
            </span>
            {TRENDING_ROLES.map((role) => (
              <Button
                key={role}
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-white/10 bg-white/[0.04] px-4 text-[12px] font-normal text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-5xl flex flex-wrap justify-between gap-8 items-center border-t border-white/10 pt-12 sm:flex-nowrap sm:gap-16">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.value}
                className="flex items-center gap-3"
              >
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
        <div className="mx-auto max-w-[760px] mt-20 border border-white/10 rounded-2xl bg-[#0a0a0a]/40 backdrop-blur-sm p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 text-center sm:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to hire top talent?
              </h2>
              <p className="mt-3 text-gray-400 sm:mt-4">
                Post a job in minutes and reach thousands of qualified
                candidates.
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end justify-end">
              <Button
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto rounded-xl px-10"
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
        <div className="absolute inset-0 [mask-image:radial-gradient(circle,white_60%,transparent_100%)] bg-[#0a0a0a]/60" />
        <div className="absolute bottom-[-12%] left-1/2 -translate-x-1/2 w-[1400px] max-w-none pointer-events-none opacity-40">
          <Image
            src="/images/globe.png"
            alt="Glowing Earth globe"
            width={1400}
            height={700}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(99,70,230,0.45)]"
          />
        </div>
        <div className="absolute bottom-[18%] left-1/2 z-10 w-full -translate-x-1/2 px-4 text-center sm:bottom-[20%] sm:text-left sm:px-0">
          <div className="max-w-2xl mx-auto sm:mx-0 sm:ml-0">
            <p className="text-lg font-medium leading-snug tracking-tight text-white/90 sm:text-2xl md:text-3xl">
              Assisting over <span className="text-indigo-400">15,000</span> job seekers{" "}
              <br />
              find their dream positions.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
