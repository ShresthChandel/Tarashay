"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatINR, formatUSD } from "@/lib/product-utils";

export function CartSheet() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotalINR = useCartStore((s) => s.getTotalINR);
  const getTotalUSD = useCartStore((s) => s.getTotalUSD);
  const itemCount = useCartStore((s) => s.itemCount);
  const count = itemCount();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-heritage-brown"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ochre text-[10px] font-bold text-off-white">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-heritage-brown/10 bg-warm-beige sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-heritage-brown">
            Your Collection
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <p className="font-serif text-lg text-heritage-brown">
              Your collection awaits
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-heritage-brown/70">
              Each piece is one of a kind — once sold, it cannot be recreated.
            </p>
            <Button
              asChild
              className="mt-8 bg-gold text-heritage-brown hover:bg-gold/90"
            >
              <Link href="/shop">Browse the Collection →</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => {
                const id = item.product._id ?? item.product.slug;
                const photo = item.product.photos[0] ?? "/placeholder.svg";
                return (
                  <li
                    key={id}
                    className="flex gap-3 rounded-lg border border-heritage-brown/10 bg-off-white p-3"
                  >
                    <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded">
                      <Image
                        src={photo}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm text-heritage-brown line-clamp-2">
                        {item.product.title}
                      </p>
                      <p className="font-sans text-xs text-heritage-brown/60">
                        {item.product.artisan.name}
                      </p>
                      <p className="font-sans text-xs text-ochre">
                        {item.product.hoursToCreate} hours of craftsmanship
                      </p>
                      <p className="mt-1 font-serif text-sm text-heritage-brown">
                        {formatINR(item.product.price.INR * item.quantity)}
                      </p>
                      {!item.product.isOneOfAKind && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(id, item.quantity - 1)
                            }
                            className="rounded border border-heritage-brown/20 p-1"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-sans text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(id, item.quantity + 1)
                            }
                            className="rounded border border-heritage-brown/20 p-1"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(id)}
                      className="shrink-0 text-heritage-brown/50 hover:text-ochre"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <Separator className="bg-heritage-brown/10" />
            <div className="space-y-4 pt-4">
              <div className="flex justify-between font-sans">
                <span className="text-heritage-brown/70">Subtotal</span>
                <div className="text-right">
                  <p className="font-serif text-lg text-heritage-brown">
                    {formatINR(getTotalINR())}
                  </p>
                  <p className="text-xs text-heritage-brown/50">
                    ≈ {formatUSD(getTotalUSD())}
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="w-full bg-gold text-heritage-brown hover:bg-gold/90"
                size="lg"
              >
                <Link href="/checkout">Proceed to Checkout →</Link>
              </Button>
              <Link
                href="/shop"
                className="block text-center font-sans text-sm text-ochre hover:underline"
              >
                Continue Browsing
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
