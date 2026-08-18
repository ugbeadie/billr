import MotionProvider from "@/components/landing/MotionProvider";
import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import ParserSection from "@/components/landing/ParserSection";
import BoardSection from "@/components/landing/BoardSection";
import TracksSection from "@/components/landing/TracksSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Page() {
  return (
    <MotionProvider>
      <div className="min-h-screen bg-white">
        <LandingNav />

        <main>
          <Hero />
          <ParserSection />
          <BoardSection />
          <TracksSection />
          <CtaSection />
        </main>

        <LandingFooter />
      </div>
    </MotionProvider>
  );
}
