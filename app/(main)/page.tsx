import Hero from "@/components/ui/hero";
import Trusted from "@/components/ui/trusted";
import Features from "@/components/ui/features";
import HowItWorks from "@/components/ui/HowItworks";
import PricingSection from "@/components/ui/Pricing";




const Homepage = () => {
  return (
    <div>
      <Hero /> 
      
      <Features />
      <HowItWorks />
      <Trusted />
      <PricingSection/>
    </div>
  )
}

export default Homepage;
