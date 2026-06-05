"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CommissionStatus, type ArtisanRef, type ICommission } from "@/types";

const STATUS_FLOW: CommissionStatus[] = [
  CommissionStatus.RECEIVED,
  CommissionStatus.REVIEWING,
  CommissionStatus.QUOTED,
  CommissionStatus.APPROVED,
  CommissionStatus.CREATING,
  CommissionStatus.FINISHING,
  CommissionStatus.SHIPPED,
  CommissionStatus.DELIVERED,
];

const STATUS_COLORS: Record<string, string> = {
  received: "bg-warm-beige text-heritage-brown",
  reviewing: "bg-ochre/20 text-ochre",
  quoted: "bg-gold/20 text-heritage-brown",
  approved: "bg-ochre/30 text-heritage-brown",
  creating: "bg-ochre/40 text-heritage-brown",
  finishing: "bg-gold/30 text-heritage-brown",
  shipped: "bg-heritage-brown/10 text-heritage-brown",
  delivered: "bg-heritage-brown text-warm-beige",
};

interface CommissionWithArtisan extends Omit<ICommission, "assignedArtisan"> {
  assignedArtisan?: ArtisanRef;
}

function formatDate(d: Date | string | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CommissionResult({ commission }: { commission: CommissionWithArtisan }) {
  const currentIdx = STATUS_FLOW.indexOf(commission.status);

  return (
    <div className="mt-6 rounded-lg border border-heritage-brown/10 bg-off-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-serif text-lg text-heritage-brown">
            {commission.referenceNumber}
          </p>
          <p className="mt-1 text-sm text-heritage-brown/60">
            Submitted {formatDate(commission.createdAt)}
          </p>
        </div>
        <Badge
          className={
            STATUS_COLORS[commission.status] ?? "bg-warm-beige text-heritage-brown"
          }
        >
          {commission.status.replace(/-/g, " ")}
        </Badge>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {STATUS_FLOW.map((status, idx) => (
          <div
            key={status}
            className={`h-2 flex-1 min-w-[40px] rounded-full ${
              idx <= currentIdx ? "bg-ochre" : "bg-heritage-brown/10"
            }`}
            title={status.replace(/-/g, " ")}
          />
        ))}
      </div>

      {commission.progressUpdates.length > 0 && (
        <div className="mt-8">
          <h4 className="font-serif text-sm text-heritage-brown">Progress Updates</h4>
          <ul className="mt-4 space-y-4">
            {[...commission.progressUpdates]
              .reverse()
              .map((update, i) => (
                <li
                  key={`${update.date}-${i}`}
                  className="border-l-2 border-gold pl-4"
                >
                  <p className="text-xs text-heritage-brown/50">
                    {formatDate(update.date)} · {update.status.replace(/-/g, " ")}
                  </p>
                  <p className="mt-1 text-sm text-heritage-brown/80">{update.note}</p>
                  {update.photo && (
                    <div className="relative mt-2 h-32 w-48 overflow-hidden rounded">
                      <Image
                        src={update.photo}
                        alt="Progress"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {commission.assignedArtisan && typeof commission.assignedArtisan === "object" && (
        <div className="mt-8 flex items-center gap-4 rounded-lg bg-warm-beige p-4">
          {commission.assignedArtisan.profilePhoto && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image
                src={commission.assignedArtisan.profilePhoto}
                alt={commission.assignedArtisan.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-heritage-brown">
              {commission.assignedArtisan.name}
            </p>
            <p className="text-xs text-heritage-brown/60">
              {commission.assignedArtisan.specialization ?? "Kunder family artisan"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function CommissionTracker() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CommissionWithArtisan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const isRef = trimmed.toUpperCase().startsWith("TRSH-");
      const url = isRef
        ? `/api/commissions/track?ref=${encodeURIComponent(trimmed.toUpperCase())}`
        : `/api/commissions/track?email=${encodeURIComponent(trimmed)}`;

      const res = await fetch(url);
      const json = (await res.json()) as {
        success: boolean;
        data?: CommissionWithArtisan | CommissionWithArtisan[];
        message?: string;
      };

      if (!json.success) {
        setError(json.message ?? "Commission not found");
        setResults([]);
        return;
      }

      const data = json.data;
      setResults(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      setError("Failed to fetch commission status");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-t border-heritage-brown/10 bg-warm-beige/50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between font-serif text-xl text-heritage-brown"
        >
          Track an Existing Commission
          <ChevronDown
            className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleTrack} className="mt-6 flex gap-3">
                <Input
                  placeholder="Email address or reference number (TRSH-2026-XXXX)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-heritage-brown/20 bg-off-white"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 bg-heritage-brown text-warm-beige hover:bg-heritage-brown/90"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
                </Button>
              </form>

              {error && (
                <p className="mt-4 text-sm text-red-700">{error}</p>
              )}

              {results !== null && results.length === 0 && !error && (
                <p className="mt-4 text-sm text-heritage-brown/60">
                  No commissions found for this email.
                </p>
              )}

              {results?.map((c) => (
                <CommissionResult key={c.referenceNumber} commission={c} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
