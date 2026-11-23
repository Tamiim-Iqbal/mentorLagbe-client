
import JoinMentorLagbe from "@/components/home/JoinMentorLagbe";
import AboutHero from "./AboutHero";
import AboutHowItWorks from "./AboutHowItWorks"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <AboutHero />
            <AboutHowItWorks />
            <JoinMentorLagbe />
        </main>
    );
}