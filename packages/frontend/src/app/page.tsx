import Image from "next/image";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";
import { Presentation } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative hero-gradient overflow-hidden">
      {/* Floating BNB logos — page level so they show behind header */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-6 left-[10%] opacity-[0.04] animate-float">
          <Image src="/bnb-logo.svg" alt="" width={80} height={80} aria-hidden />
        </div>
        <div className="absolute top-16 right-[15%] opacity-[0.04] animate-float-delayed">
          <Image src="/bnb-logo.svg" alt="" width={60} height={60} aria-hidden />
        </div>
      </div>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
      <a
        href="/pitch-deck.html"
        target="_blank"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#F0B90B] px-4 py-2.5 text-sm font-semibold text-[#181A20] shadow-lg transition-transform hover:scale-105"
      >
        <Presentation className="h-4 w-4" />
        Pitch Deck
      </a>
    </div>
  );
}
