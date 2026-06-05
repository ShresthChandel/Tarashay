import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-heritage-brown">
        Artwork Not Found
      </h1>
      <p className="mt-4 font-sans text-heritage-brown/70">
        This piece may have been sold or moved. Each supari sculpture is one of
        a kind — explore what remains in the collection.
      </p>
      <Button asChild className="mt-8 bg-ochre text-off-white hover:bg-ochre/90">
        <Link href="/shop">Browse the Collection</Link>
      </Button>
    </div>
  );
}
