import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CraftCounter } from "@/components/home/CraftCounter";
import { OriginTeaser } from "@/components/home/OriginTeaser";
import { ArtisansBanner } from "@/components/home/ArtisansBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ImpactStrip } from "@/components/home/ImpactStrip";
import { FamilyQuote } from "@/components/home/FamilyQuote";
import { CommissionCTA } from "@/components/home/CommissionCTA";
import ArtisanCard from "@/components/artisan/ArtisanCard";
import {
  fetchArtisansList,
  fetchFeaturedProducts,
} from "@/lib/fetch-api";
import {
  IMPACT_STATS,
  KUNDER_FAMILY_QUOTE,
  PLACEHOLDER_ARTISANS,
} from "@/lib/placeholders/home";
import type { IArtisan } from "@/types";

export const metadata: Metadata = {
  title: "Home",
  description:
    "तराशय — Witness Rewa Supari Art, an 80-year endangered areca nut craft by the Kunder family. Only 4–5 artisans worldwide practice this royal court tradition.",
  openGraph: {
    title: "तराशय | Rewa Supari Art",
    description:
      "80 years. 4 generations. One family keeping an irreplaceable Indian craft alive.",
  },
};

export default async function HomePage() {
  const [dbArtisans, products] = await Promise.all([
    fetchArtisansList(),
    fetchFeaturedProducts(4),
  ]);

  const featuredArtisans: IArtisan[] =
    dbArtisans.length > 0
      ? (dbArtisans.slice(0, 3) as IArtisan[])
      : PLACEHOLDER_ARTISANS.map((a) => ({
          name: a.name,
          slug: a.slug,
          generation: a.generation,
          specialization: a.specialization,
          bio: "Fourth generation guardian of Rewa Supari Art.",
          story: "",
          yearsExperience: a.yearsExperience,
          totalPiecesCreated: a.totalPiecesCreated,
          profilePhoto: a.profilePhoto,
          workshopPhotos: [],
          awardsWon: [],
          featuredIn: [],
          isActive: true,
        }));

  return (
    <>
      <HeroSection />
      <CraftCounter />
      <OriginTeaser />

      <section className="bg-off-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">कारीगर</p>
            <h2 className="mt-3 font-serif text-3xl text-heritage-brown sm:text-4xl">
              The Hands Behind the Art
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-sans text-heritage-brown/70">
              Meet the Kunder family — fourth generation guardians of a craft
              born in the maharaja&apos;s court.
            </p>
          </div>

          <ArtisansBanner />

          <div className="grid gap-8 md:grid-cols-3">
            {featuredArtisans.map((artisan, index) => (
              <ArtisanCard
                key={artisan.slug}
                artisan={artisan}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} />
      <ImpactStrip
        piecesSold={IMPACT_STATS.piecesSold}
        countriesReached={IMPACT_STATS.countriesReached}
        artisansSupported={IMPACT_STATS.artisansSupported}
      />
      <FamilyQuote
        text={KUNDER_FAMILY_QUOTE.text}
        attribution={KUNDER_FAMILY_QUOTE.attribution}
      />
      <CommissionCTA />
    </>
  );
}
