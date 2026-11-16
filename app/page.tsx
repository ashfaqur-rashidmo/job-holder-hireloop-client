import HeroSection from "@/components/Hero-Section"
import { Footer } from "@/components/footer"
import CtaSection from "@/app/component/Home/CtaSection"
import FeaturesSection from "@/app/component/Home/FeaturesSection"
import JobDiscoverySection from "@/app/component/Home/JobDiscoverySection"
import PricingSection from "@/app/component/Home/PricingSection"

export default function Page() {
  return (
    <>
      <HeroSection />
      <JobDiscoverySection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </>
  )
}
