import type { Metadata } from "next";
import { Timeline } from "@/components/story/Timeline";
import { TIMELINE_EVENTS } from "@/lib/placeholders/story";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "From the royal court of Rewa in 1942 to Prime Minister Indira Gandhi in 1968 — the timeline of Rewa Supari Art and the Kunder family.",
};

export default function StoryPage() {
  return (
    <div className="bg-off-white">
      <header className="border-b border-heritage-brown/10 bg-warm-beige py-20 text-center">
        <p className="font-devanagari text-lg text-ochre">कथा</p>
        <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl">
          Eight Decades of Supari Art
        </h1>
        <p className="mx-auto mt-6 max-w-2xl px-4 font-sans text-heritage-brown/70">
          A vertical journey through the Kunder family — from maharaja&apos;s court
          to a craft fighting for survival in the modern world.
        </p>
      </header>

      <Timeline events={TIMELINE_EVENTS} />
    </div>
  );
}
