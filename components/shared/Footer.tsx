import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "/story", label: "Our Story" },
  { href: "/artisans", label: "Artisans" },
  { href: "/shop", label: "Collection" },
  { href: "/commission", label: "Commission" },
  { href: "/impact", label: "Impact" },
  { href: "/learn", label: "Learn" },
];

export function Footer() {
  return (
    <footer className="border-t border-heritage-brown/10 bg-heritage-brown text-warm-beige">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-devanagari text-3xl font-semibold text-gold">
              तराशय
            </p>
            <p className="mt-2 font-serif text-lg text-warm-beige/90">
              Rewa Supari Art
            </p>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-warm-beige/70">
              A cultural embassy for an 80-year-old areca nut craft born in the
              royal court of Rewa. Preserving the Kunder family legacy — one
              sculpture at a time.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm tracking-widest text-gold uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-warm-beige/80 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm tracking-widest text-gold uppercase">
              Visit
            </h3>
            <address className="mt-4 not-italic font-sans text-sm leading-relaxed text-warm-beige/70">
              Kunder Family Workshop
              <br />
              Rewa, Madhya Pradesh
              <br />
              India
            </address>
            <p className="mt-4 font-sans text-xs text-warm-beige/50">
              Est. 1942 · 4th generation
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-warm-beige/20" />

        <p className="text-center font-sans text-xs text-warm-beige/50">
          © {new Date().getFullYear()} तराशय. Craft practiced by fewer than five
          artisans worldwide.
        </p>
      </div>
    </footer>
  );
}
