import Image from "next/image"
import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#050505] pt-28 pb-44 text-white sm:pt-36 sm:pb-52">
      {/* Dome backdrop: the shared globe.png. The image's pink/white top
          area is masked out so only the glowing sphere arc shows. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1882}
          className="absolute left-1/2 top-[-380px] w-[1100px] max-w-none -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_42%)] sm:top-[-420px] sm:w-[1300px]"
        />
      </div>

      {/* Fade the dome's lower edges back into the page background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"
      />

      {/* CTA content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your next role is already looking for you
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm text-white/50 sm:text-base">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Create a free account
          </Link>
          <Link
            href="/#pricing"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
