import type { Metadata } from "next";
import Link from "next/link";
import { Hand, Leaf, Sprout } from "lucide-react";
import { getImpactStats } from "@/lib/impact-stats";
import { ImpactCountCards } from "@/components/impact/ImpactCountCards";
import { ImpactPriceChart } from "@/components/impact/ImpactPriceChart";
import { GlobalMap } from "@/components/shared/GlobalMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Our Impact — Tarashay",
  description:
    "See how Tarashay is preserving Rewa Supari Art — the numbers behind the mission.",
};

const IMPACT_CARDS = [
  "Rising costs threaten production",
  "Each sale directly funds raw material purchase",
  "Your commission keeps the workshop running",
];

const HELP_COLUMNS = [
  {
    icon: Hand,
    title: "The Artisan",
    text: "70% of every sale goes directly to the Kunder family artisan who created the piece.",
  },
  {
    icon: Leaf,
    title: "The Craft",
    text: "Every purchase funds raw material from Kerala, keeping the workshop active and the craft alive.",
  },
  {
    icon: Sprout,
    title: "The Future",
    text: "Revenue from Tarashay funds the training program to teach the next generation of artisans.",
  },
];

export default async function ImpactPage() {
  const stats = await getImpactStats();

  return (
    <div className="bg-off-white">
      <header className="bg-warm-beige py-20 text-center">
        <p className="font-devanagari text-lg text-ochre">प्रभाव</p>
        <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl">
          Every Purchase is an Act of Preservation
        </h1>
        <p className="mx-auto mt-6 max-w-2xl px-4 font-sans text-heritage-brown/70">
          The Kunder family has kept this craft alive for 80 years. Here is what we
          are building together.
        </p>
      </header>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ImpactCountCards stats={stats} />
        </div>
      </section>

      <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            Why Your Purchase Matters More Than Ever
          </h2>
          <div className="mt-12">
            <ImpactPriceChart />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {IMPACT_CARDS.map((text) => (
              <div
                key={text}
                className="rounded-lg border border-heritage-brown/10 bg-off-white p-5 text-center text-sm text-heritage-brown/80"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            How Your Purchase Helps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HELP_COLUMNS.map((col) => (
              <div key={col.title} className="text-center">
                <col.icon className="mx-auto h-10 w-10 text-ochre" />
                <h3 className="mt-4 font-serif text-xl text-heritage-brown">
                  {col.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-heritage-brown/70">
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            Rewa&apos;s Art, In Homes Around the World
          </h2>
          <div className="mt-10">
            <GlobalMap countries={stats.countries} />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">
            Teaching the Next Generation
          </h2>
          <p className="mt-6 text-heritage-brown/75 leading-relaxed">
            The 4th generation Kunder family has expressed willingness to teach.
            Tarashay is building a structured program to bring new artisans into
            this tradition.
          </p>
          <Badge className="mt-6 bg-ochre/20 text-ochre">Coming Soon</Badge>
          <Button
            asChild
            className="mt-8 bg-heritage-brown text-warm-beige hover:bg-heritage-brown/90"
          >
            <Link href="/commission?category=custom">
              Express Interest in Training →
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
