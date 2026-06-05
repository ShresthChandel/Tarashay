"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              "font-sans bg-heritage-brown text-warm-beige border-gold/30",
          },
        }}
      />
    </>
  );
}
