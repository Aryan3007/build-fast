import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Features } from "@/components/landing/features";
import { Comparison } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen mx-auto flex-col bg-white text-zinc-950">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto">
        <Hero />
        <Problem />
        <Features />
        <Comparison />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
