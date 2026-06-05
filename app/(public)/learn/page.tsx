import type { Metadata } from "next";
import Link from "next/link";
import {
  Nut,
  TreePine,
  Hammer,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Learn About Rewa Supari Art — Tarashay",
  description:
    "The complete guide to Rewa Supari Art — history, process, materials, and the Kunder family legacy.",
};

const MATERIALS = [
  {
    icon: Nut,
    title: "Areca Nut (Supari)",
    text: "Sourced from Kerala — selected for size, density, and carving quality.",
  },
  {
    icon: TreePine,
    title: "Wooden Framework",
    text: "A sturdy wooden base provides structural support for larger sculptures.",
  },
  {
    icon: Hammer,
    title: "Traditional Adhesives",
    text: "Time-tested natural adhesives bind components without modern synthetics.",
  },
  {
    icon: Layers,
    title: "Hand Tools",
    text: "Simple chisels, knives, and files — the same tools used since 1942.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Selection & Segregation",
    description:
      "Raw areca nuts arrive from Kerala and are sorted by size, colour, and structural integrity. Only nuts meeting strict criteria are chosen — a single flawed nut can compromise an entire sculpture.",
  },
  {
    title: "Design Planning",
    description:
      "The artisan sketches the vision — proportions, ornamentation, and the narrative the piece will tell. For temple sets and idols, traditional iconographic rules guide every decision.",
  },
  {
    title: "Wooden Base Preparation",
    description:
      "A wooden framework is carved to match the sculpture's dimensions. This invisible skeleton bears the weight and allows the supari components to be assembled with precision.",
  },
  {
    title: "Shaping the Supari",
    description:
      "Each nut is individually carved — hollowed, shaped, and smoothed by hand. This is the most labour-intensive stage; a single Ganesh idol may require hundreds of individually shaped nuts.",
  },
  {
    title: "Component Creation",
    description:
      "Arms, crowns, ornaments, and architectural details are created as separate components. Each piece is carved, polished, and fitted before assembly begins.",
  },
  {
    title: "Assembly",
    description:
      "Components are joined to the wooden base using traditional adhesives. The artisan works methodically, ensuring structural integrity and visual harmony across the entire piece.",
  },
  {
    title: "Finishing & Framing",
    description:
      "Final polishing, protective treatment, and framing complete the work. Each finished piece receives a signed certificate of authenticity from the creating artisan.",
  },
];

const CREATION_TYPES = [
  { title: "Ganesh Idols", text: "The most popular commission — Lord Ganesh in supari, from palm-sized to life-scale.", popular: true },
  { title: "Temple Models", text: "Miniature temple architecture — domes, spires, and sanctums rendered in areca nut." },
  { title: "Walking Sticks", text: "Functional art — carved handles atop sturdy shafts, a royal court tradition." },
  { title: "Sindoordan", text: "Ceremonial vermilion containers — essential in Hindu wedding rituals." },
  { title: "Decorative Sculptures", text: "Non-religious ornamental pieces for homes and collections worldwide." },
  { title: "Religious Idols", text: "Lakshmi, Saraswati, Shiva, and other deities in the supari medium." },
  { title: "Custom Commissions", text: "Entirely new creations — your vision, interpreted by a master artisan." },
];

const TIMELINE = [
  { year: "1942", event: "The Kunder family begins practising supari carving in Rewa, Madhya Pradesh — commissioned by the royal court." },
  { year: "1968", event: "Prime Minister Indira Gandhi visits the workshop. National recognition follows." },
  { year: "Present", event: "Fourth-generation artisans keep the craft alive as raw material costs rise tenfold. Tarashay connects the world to Rewa." },
];

export default function LearnPage() {
  return (
    <div className="bg-off-white">
      <header className="border-b border-heritage-brown/10 bg-warm-beige py-20 text-center">
        <p className="font-devanagari text-lg text-ochre">ज्ञान</p>
        <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl">
          The Knowledge Vault
        </h1>
        <p className="mx-auto mt-6 max-w-2xl px-4 font-sans text-heritage-brown/70">
          Everything known about Rewa Supari Art, documented for the world.
        </p>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="font-serif text-3xl text-heritage-brown">What is Supari Art?</h2>
        <p className="mt-6 leading-relaxed text-heritage-brown/80">
          Rewa Supari Art is the practice of carving areca nuts (supari) — sourced
          from the plantations of Kerala — into intricate sculptures, idols, temple
          models, and ceremonial objects. The craft has been practised by the Kunder
          family since 1942, when they were first commissioned by the Maharaja of
          Rewa&apos;s royal court.
        </p>
        <p className="mt-4 leading-relaxed text-heritage-brown/80">
          Unlike wood or stone carving, supari art works with a material that is
          simultaneously organic and architectural. Each nut is individually shaped,
          hollowed, and assembled into forms of extraordinary detail — from the
          trunk of Lord Ganesh to the spires of a miniature temple.
        </p>
        <blockquote className="mt-8 border-l-4 border-ochre pl-6 font-serif text-xl italic text-heritage-brown">
          &ldquo;A craft so rare, only one family in the world practices it.&rdquo;
        </blockquote>
      </section>

      <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            The Materials
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MATERIALS.map((m) => (
              <div
                key={m.title}
                className="rounded-lg border border-heritage-brown/10 bg-off-white p-6"
              >
                <m.icon className="h-8 w-8 text-ochre" />
                <h3 className="mt-4 font-serif text-lg text-heritage-brown">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-heritage-brown/70">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">
            The Complete Process
          </h2>
          <div className="mt-12 space-y-10">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold font-serif text-ochre">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-heritage-brown">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-heritage-brown/75">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            Types of Creations
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CREATION_TYPES.map((t) => (
              <div
                key={t.title}
                className="rounded-lg border border-heritage-brown/10 bg-off-white p-5"
              >
                <h3 className="font-serif text-lg text-heritage-brown">
                  {t.title}
                  {t.popular && (
                    <span className="ml-2 text-xs text-ochre">(most popular)</span>
                  )}
                </h3>
                <p className="mt-2 text-sm text-heritage-brown/70">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">
            Historical Timeline
          </h2>
          <div className="mt-10 space-y-8 border-l-2 border-gold pl-8">
            {TIMELINE.map((t) => (
              <div key={t.year}>
                <p className="font-serif text-2xl text-ochre">{t.year}</p>
                <p className="mt-2 text-heritage-brown/80">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">
            The Kunder Family
          </h2>
          <p className="mt-6 leading-relaxed text-heritage-brown/75">
            For four generations, the Kunder family of Rewa has been the sole
            practitioners of this art form. Their workshop in Madhya Pradesh is
            where every piece on Tarashay is created — by hand, from Kerala supari,
            with tools unchanged since the royal court era.
          </p>
          <Button asChild variant="outline" className="mt-8 border-ochre text-ochre">
            <Link href="/artisans">Meet the Artisans →</Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="flex items-center gap-3 font-serif text-3xl text-heritage-brown">
            <Award className="h-8 w-8 text-ochre" />
            Recognition &amp; Awards
          </h2>
          <ul className="mt-6 space-y-3 text-heritage-brown/80">
            <li>National handicraft awards conferred on Kunder family artisans</li>
            <li>International collectors and museums across five continents</li>
            <li>1968 — Prime Minister Indira Gandhi visits the Rewa workshop</li>
            <li>Featured in cultural heritage documentation by state and central government</li>
          </ul>
        </div>
      </section>

      <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="flex items-center gap-3 font-serif text-3xl text-heritage-brown">
            <BookOpen className="h-8 w-8 text-ochre" />
            For Educators
          </h2>
          <h3 className="mt-6 font-serif text-xl text-heritage-brown">
            Supari Art in the Classroom
          </h3>
          <p className="mt-4 leading-relaxed text-heritage-brown/75">
            Rewa Supari Art offers a unique lens for teaching Indian cultural
            heritage, traditional craftsmanship, material science, and economic
            sustainability. Our study materials are designed for students aged 12+.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-ochre text-off-white hover:bg-ochre/90">
              <Link href="#">Download Study Material</Link>
            </Button>
            <Button asChild variant="outline" className="border-heritage-brown/30">
              <Link href="/commission">Request a School Program</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            Press &amp; Media
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-dashed border-heritage-brown/20 bg-warm-beige/50 p-8 text-center text-sm text-heritage-brown/50"
              >
                Tarashay in the news — coming soon
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
