import type { Metadata } from "next";
import { ArtisanGrid } from "@/components/artisan/ArtisanGrid";
import { fetchArtisansList } from "@/lib/fetch-api";
import type { IArtisan } from "@/types";

export const metadata: Metadata = {
  title: "Artisans",
  description:
    "Meet the Kunder family of Rewa — four generations and the only practitioners of Rewa Supari Art in the world.",
  openGraph: {
    title: "The Hands Behind the Art | तराशय",
    description:
      "Four generations of the Kunder family — guardians of endangered areca nut sculpture from Madhya Pradesh.",
  },
};

export default async function ArtisansPage() {
  const artisans = await fetchArtisansList();

  return (
    <div className="bg-off-white">
      <header className="border-b border-heritage-brown/10 bg-warm-beige py-20 text-center">
        <p className="font-devanagari text-lg text-ochre">कारीगर</p>
        <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl">
          The Hands Behind the Art
        </h1>
        <p className="mx-auto mt-6 max-w-2xl px-4 font-sans text-lg text-heritage-brown/75">
          Four generations of the Kunder family — the only practitioners of Rewa
          Supari Art in the world.
        </p>
      </header>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {artisans.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-lg border border-heritage-brown/10 bg-warm-beige/50 p-12 text-center">
              <p className="font-serif text-xl text-heritage-brown">
                Our artisans&apos; stories are being prepared
              </p>
              <p className="mt-4 font-sans text-heritage-brown/70">
                The Kunder family workshop records are coming soon. Rewa Supari
                Art has been carved since 1942 — check back shortly to meet the
                hands behind each sculpture.
              </p>
            </div>
          ) : (
            <ArtisanGrid artisans={artisans as IArtisan[]} />
          )}
        </div>
      </section>
    </div>
  );
}
