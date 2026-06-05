import type { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Artisan from "@/models/Artisan";
import { ArtisanHero } from "@/components/artisan/ArtisanHero";
import { ArtisanStatsRow } from "@/components/artisan/ArtisanStatsRow";
import { ArtisanVideoSection } from "@/components/artisan/ArtisanVideoSection";
import { ArtisanCommissionCTA } from "@/components/artisan/ArtisanCommissionCTA";
import { ProductCard } from "@/components/product/ProductCard";
import { dtoToPopulatedProduct } from "@/lib/product-utils";
import {
  fetchArtisanBySlug,
  fetchProductsByArtisanSlug,
} from "@/lib/fetch-api";
import type { IArtisan } from "@/types";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const artisans = await Artisan.find({ isActive: true })
      .select("slug")
      .lean();
    return artisans.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const artisan = await fetchArtisanBySlug(params.slug);

  if (!artisan) {
    return { title: "Artisan Not Found" };
  }

  return {
    title: artisan.name,
    description: `${artisan.name} — ${artisan.specialization}. ${artisan.generation}th generation Rewa Supari Art artisan from the Kunder family, Rewa.`,
    openGraph: {
      title: `${artisan.name} | तराशय`,
      description: artisan.bio,
      images: artisan.profilePhoto ? [artisan.profilePhoto] : undefined,
    },
  };
}

export default async function ArtisanProfilePage({ params }: PageProps) {
  const artisan = await fetchArtisanBySlug(params.slug);

  if (!artisan) {
    notFound();
  }

  const products = await fetchProductsByArtisanSlug(params.slug);
  const typedArtisan = artisan as IArtisan;

  const hasAwards =
    (typedArtisan.awardsWon?.length ?? 0) > 0 ||
    (typedArtisan.featuredIn?.length ?? 0) > 0;

  return (
    <>
      <ArtisanHero artisan={typedArtisan} />

      <section className="timeline-sepia bg-warm-beige/80 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">Personal Story</h2>
          <p className="mt-8 font-sans text-lg leading-relaxed text-heritage-brown/85 whitespace-pre-line">
            {typedArtisan.story ||
              typedArtisan.bio ||
              "This artisan's story is being documented as part of our effort to preserve Rewa Supari Art for future generations."}
          </p>
        </div>
      </section>

      <ArtisanStatsRow artisan={typedArtisan} />

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">
            Specialization
          </h2>
          <p className="mt-4 font-sans text-lg text-ochre">
            {typedArtisan.specialization}
          </p>
          <p className="mt-6 font-sans text-base leading-relaxed text-heritage-brown/80">
            {typedArtisan.bio ||
              `${typedArtisan.name} works exclusively in areca nut (supari) — a material that cannot be rushed. Each piece reflects techniques passed from parent to child in the Kunder family workshop in Rewa.`}
          </p>
        </div>
      </section>

      {hasAwards && (
        <section className="border-y border-heritage-brown/10 bg-warm-beige/40 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-serif text-3xl text-heritage-brown">
              Awards & Recognition
            </h2>
            {typedArtisan.awardsWon && typedArtisan.awardsWon.length > 0 && (
              <div className="mt-8">
                <h3 className="font-sans text-sm tracking-widest text-ochre uppercase">
                  Awards
                </h3>
                <ul className="mt-4 space-y-2">
                  {typedArtisan.awardsWon.map((award) => (
                    <li
                      key={award}
                      className="font-sans text-heritage-brown/80 before:mr-2 before:text-gold before:content-['•']"
                    >
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {typedArtisan.featuredIn && typedArtisan.featuredIn.length > 0 && (
              <div className="mt-10">
                <h3 className="font-sans text-sm tracking-widest text-ochre uppercase">
                  Featured In
                </h3>
                <ul className="mt-4 space-y-2">
                  {typedArtisan.featuredIn.map((feature) => (
                    <li
                      key={feature}
                      className="font-sans text-heritage-brown/80 before:mr-2 before:text-gold before:content-['•']"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-3xl text-heritage-brown">
            Their Work
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center font-sans text-heritage-brown/70">
            Sculptures carved from raw supari by {typedArtisan.name}
          </p>
          {products.length === 0 ? (
            <p className="mx-auto mt-12 max-w-md text-center font-sans text-heritage-brown/60">
              New works from this artisan are being added. Commission a custom
              piece to collaborate directly with the Kunder family.
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.slug}
                  product={dtoToPopulatedProduct(product)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ArtisanVideoSection artisan={typedArtisan} />
      <ArtisanCommissionCTA artisan={typedArtisan} />
    </>
  );
}
