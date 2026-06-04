import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-devanagari text-ochre">तराशय</p>
      <h1 className="mt-4 font-serif text-3xl text-heritage-brown sm:text-4xl">
        {title}
      </h1>
      <p className="mt-6 font-sans text-heritage-brown/70">{description}</p>
      <Button asChild className="mt-10 bg-ochre text-off-white hover:bg-ochre/90">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
