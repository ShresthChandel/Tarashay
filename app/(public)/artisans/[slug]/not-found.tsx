import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArtisanNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-heritage-brown">
        Artisan Not Found
      </h1>
      <p className="mt-4 font-sans text-heritage-brown/70">
        This profile may have been moved, or the craftsperson is no longer
        listed. The Kunder family workshop in Rewa remains the heart of Supari
        Art.
      </p>
      <Button asChild className="mt-8 bg-ochre text-off-white hover:bg-ochre/90">
        <Link href="/artisans">Meet All Artisans</Link>
      </Button>
    </div>
  );
}
