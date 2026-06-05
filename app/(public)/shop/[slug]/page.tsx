import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin, Ruler, Scale } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ArtisanMiniCard } from "@/components/product/ArtisanMiniCard";
import { ArtisanProfileCard } from "@/components/product/ArtisanProfileCard";
import { ProductCard } from "@/components/product/ProductCard";
import {
  fetchProductBySlug,
  fetchRelatedProducts,
} from "@/lib/fetch-api";
import {
  DEFAULT_PROCESS_STEPS,
  getCategoryLabel,
} from "@/lib/product-utils";
import type { ProcessStep } from "@/types";
import { ProductStatus } from "@/types";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const products = await Product.find().select("slug").lean();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return { title: "Artwork Not Found" };

  const storyExcerpt = product.story.slice(0, 150);
  const photo = product.photos[0];

  return {
    title: `${product.title} — Tarashay`,
    description: `Created by ${product.artisan.name}. ${product.hoursToCreate} hours of craftsmanship. ${storyExcerpt}`,
    openGraph: {
      title: `${product.title} | तराशय`,
      description: storyExcerpt,
      images: photo ? [photo] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) notFound();

  const related = await fetchRelatedProducts(
    product.artisan.slug,
    product.slug,
    3
  );

  const processSteps: ProcessStep[] =
    product.process.length > 0
      ? product.process
      : DEFAULT_PROCESS_STEPS.map((s) => ({
          step: s.step,
          description: s.description,
        }));

  const dims = product.dimensions;
  const dimLabel = `${dims.height}×${dims.width}×${dims.depth} ${dims.unit}`;

  return (
    <div className="bg-off-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery photos={product.photos} title={product.title} />

          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border-0 bg-heritage-brown/10 text-heritage-brown">
                  {getCategoryLabel(product.category)}
                </Badge>
                {product.isOneOfAKind && (
                  <Badge className="border-0 bg-gold text-heritage-brown">
                    One of a Kind
                  </Badge>
                )}
                {product.status === ProductStatus.SOLD && (
                  <Badge variant="secondary">Sold</Badge>
                )}
              </div>
              <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl">
                {product.title}
              </h1>
            </div>

            <ArtisanMiniCard artisan={product.artisan} />
            <ProductPurchase product={product} />
          </div>
        </div>
      </div>

      <section className="timeline-sepia border-y border-heritage-brown/10 bg-warm-beige py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Separator className="mb-10 bg-ochre/30" />
          <p className="font-sans text-sm tracking-[0.2em] text-ochre uppercase">
            The Story
          </p>
          <p className="mt-6 font-sans text-xl leading-relaxed text-heritage-brown/90">
            {product.story ||
              "Every supari sculpture carries the patience of the Kunder family workshop — shaped over weeks from raw areca nut in Rewa, Madhya Pradesh."}
          </p>
          <Separator className="mt-10 bg-ochre/30" />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          {[
            {
              icon: Clock,
              value: `${product.hoursToCreate}`,
              unit: "Hours",
              desc: "of patient craftsmanship",
            },
            {
              icon: Scale,
              value: `${product.rawMaterialGrams}g`,
              unit: "",
              desc: "of Kerala areca nut",
            },
            {
              icon: Ruler,
              value: dimLabel,
              unit: "",
              desc: "exact dimensions",
            },
            {
              icon: MapPin,
              value: "Rewa, MP",
              unit: "",
              desc: "origin",
            },
          ].map((stat) => (
            <div
              key={stat.desc}
              className="rounded-lg border border-heritage-brown/10 bg-warm-beige p-6 text-center"
            >
              <stat.icon className="mx-auto h-6 w-6 text-ochre" />
              <p className="mt-3 font-serif text-2xl text-heritage-brown">
                {stat.value}
                {stat.unit && (
                  <span className="block text-sm font-sans text-heritage-brown/60">
                    {stat.unit}
                  </span>
                )}
              </p>
              <p className="mt-2 font-sans text-xs text-heritage-brown/60">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-heritage-brown">
            The Making
          </h2>
          <ol className="mt-10 space-y-8">
            {processSteps.map((step) => (
              <li key={step.step} className="flex gap-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-serif text-heritage-brown">
                  {step.step}
                </span>
                <div className="flex-1">
                  <p className="font-sans leading-relaxed text-heritage-brown/85">
                    {step.description}
                  </p>
                  {step.photo && (
                    <div className="relative mt-4 aspect-video max-w-md overflow-hidden rounded-lg">
                      <Image
                        src={step.photo}
                        alt={`Step ${step.step} — ${product.title} creation process`}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <ArtisanProfileCard artisan={product.artisan} />
      </section>

      {related.length > 0 && (
        <section className="border-t border-heritage-brown/10 bg-warm-beige/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-heritage-brown">
              More from {product.artisan.name}
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, index) => (
                <ProductCard key={p.slug} product={p} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
