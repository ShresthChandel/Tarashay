"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}
