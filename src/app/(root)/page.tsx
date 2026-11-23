import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import JoinMentorLagbe from "@/components/home/JoinMentorLagbe";
import LatestTuitions from "@/components/home/LatestTuitions";
import Pricing from "@/components/home/Pricing";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LatestTuitions />
      <HowItWorks />
      <Pricing />
      <JoinMentorLagbe />
    </>
  );
}
