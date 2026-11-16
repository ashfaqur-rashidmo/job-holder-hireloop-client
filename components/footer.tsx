import Image from "next/image"
import Link from "next/link"

type FooterLink = {
  label: string
  href: string
}

// lucide-react no longer ships brand icons — inline the glyphs instead.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 6.281v5.641zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  )
}

const PRODUCT_LINKS: FooterLink[] = [
  { label: "Job discovery", href: "/browse-jobs" },
  { label: "Worker AI", href: "#" },
  { label: "Companies", href: "/company" },
  { label: "Salary data", href: "#" },
]

const NAVIGATION_LINKS: FooterLink[] = [
  { label: "Help center", href: "#" },
  { label: "Career library", href: "#" },
  { label: "Contact", href: "#" },
]

const RESOURCE_LINKS: FooterLink[] = [
  { label: "Brand Guideline", href: "#" },
  { label: "Newsroom", href: "#" },
]

const LINK_GROUPS: { title: string; links: FooterLink[] }[] = [
  { title: "Product", links: PRODUCT_LINKS },
  { title: "Navigations", links: NAVIGATION_LINKS },
  { title: "Resources", links: RESOURCE_LINKS },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#050505] pt-16 pb-8 text-white">
      {/* Faint wireframe grid fading from the top, echoing the CTA dome */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 opacity-50 [background-image:repeating-linear-gradient(to_right,rgba(255,255,255,0.05)_0_1px,transparent_1px_52px),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0_1px,transparent_1px_52px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="HireLoop"
                width={124}
                height={36}
                priority
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                aria-label="HireLoop on Facebook"
                className="flex size-8 items-center justify-center rounded-lg bg-[#141414] text-white/80 transition-colors hover:bg-[#1f1f1f] hover:text-white"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="#"
                aria-label="HireLoop on Product Hunt"
                className="flex size-8 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-500"
              >
                <span className="text-sm font-bold">P</span>
              </a>
              <a
                href="#"
                aria-label="HireLoop on LinkedIn"
                className="flex size-8 items-center justify-center rounded-lg bg-[#141414] text-white/80 transition-colors hover:bg-[#1f1f1f] hover:text-white"
              >
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {LINK_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="text-sm font-semibold text-indigo-400">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>
            Copyright 2024 —{" "}
            <span className="text-indigo-400">Programming Hero</span>
          </p>
          <p>Terms &amp; Policy - Privacy Guideline</p>
        </div>
      </div>
    </footer>
  )
}
