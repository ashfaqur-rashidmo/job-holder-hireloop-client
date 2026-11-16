import {
  Bookmark,
  Building2,
  FileText,
  LineChart,
  Search,
  Shapes,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: LineChart,
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
  },
  {
    icon: Building2,
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: Sparkles,
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process!",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: Shapes,
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#050505] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-indigo-500" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase">
            Features Job
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-indigo-500" />
        </div>

        {/* Heading */}
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-bold tracking-tight sm:text-5xl">
          Everything you need to succeed
        </h2>

        {/* Feature grid */}
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#111111]">
                <feature.icon className="size-5 text-indigo-400" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
