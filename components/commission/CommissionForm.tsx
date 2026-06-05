"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCategory, type IArtisan } from "@/types";
import { COUNTRIES, PHONE_CODES } from "@/lib/countries";
import type { BudgetOption } from "@/lib/commission-budget";

const CATEGORIES = [
  { label: "Ganesh Idol", value: ProductCategory.GANESH_IDOL },
  { label: "Temple Set", value: ProductCategory.TEMPLE_SET },
  { label: "Decorative Piece", value: ProductCategory.DECORATIVE },
  { label: "Walking Stick", value: ProductCategory.WALKING_STICK },
  { label: "Sindoordan", value: ProductCategory.SINDOORDAN },
  { label: "Religious Sculpture", value: ProductCategory.RELIGIOUS },
  { label: "Something New", value: "something-new" },
] as const;

const BUDGET_OPTIONS: { value: BudgetOption; label: string }[] = [
  { value: "under-5k", label: "Under ₹5,000" },
  { value: "5k-15k", label: "₹5,000 – ₹15,000" },
  { value: "15k-50k", label: "₹15,000 – ₹50,000" },
  { value: "above-50k", label: "Above ₹50,000" },
  { value: "flexible", label: "Flexible" },
];

const HOW_HEARD = [
  "Instagram",
  "Google",
  "Friend/Family",
  "News/Article",
  "Other",
] as const;

interface FormState {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  country: string;
  description: string;
  category: string;
  preferredArtisan: string;
  budget: BudgetOption | "";
  howHeard: string;
}

export function CommissionForm() {
  const searchParams = useSearchParams();
  const prefillArtisan = searchParams.get("artisan") ?? "";
  const prefillCategory = searchParams.get("category") ?? "";

  const [artisans, setArtisans] = useState<IArtisan[]>([]);
  const [uploadEnabled, setUploadEnabled] = useState<boolean | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phoneCode: "+91",
    phone: "",
    country: "India",
    description: "",
    category: prefillCategory || ProductCategory.GANESH_IDOL,
    preferredArtisan: prefillArtisan || "auto",
    budget: "",
    howHeard: "",
  });

  useEffect(() => {
    fetch("/api/artisans")
      .then((r) => r.json())
      .then((json: { success: boolean; data?: IArtisan[] }) => {
        if (json.success && json.data) setArtisans(json.data);
      })
      .catch(() => {});

    fetch("/api/upload", { method: "OPTIONS" }).catch(() => {});
    setUploadEnabled(
      Boolean(
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
          // probe on first upload attempt instead
          null
      )
    );
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length || imageUrls.length >= 3) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files).slice(0, 3 - imageUrls.length)) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.status === 503) {
          setUploadEnabled(false);
          toast.info("Image upload coming soon");
          break;
        }
        const json = (await res.json()) as {
          success: boolean;
          data?: { url: string };
        };
        if (json.success && json.data?.url) {
          newUrls.push(json.data.url);
          setUploadEnabled(true);
        }
      } catch {
        setUploadEnabled(false);
      }
    }

    setImageUrls((prev) => [...prev, ...newUrls].slice(0, 3));
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.description.length < 50) {
      toast.error("Please describe your vision in at least 50 characters.");
      return;
    }
    if (!form.budget) {
      toast.error("Please select a budget range.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: `${form.phoneCode} ${form.phone}`.trim(),
          country: form.country,
          description: form.description,
          category: form.category,
          preferredArtisan: form.preferredArtisan,
          budget: form.budget,
          howHeard: form.howHeard,
          referenceImages: imageUrls,
        }),
      });

      const json = (await res.json()) as {
        success: boolean;
        data?: { referenceNumber: string; commissionId: string };
        message?: string;
      };

      if (!json.success || !json.data) {
        toast.error(json.message ?? "Failed to submit request");
        return;
      }

      setSuccessRef(json.data.referenceNumber);
      toast.success("Your vision has been received!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (successRef) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-lg border border-gold/40 bg-warm-beige p-10 text-center"
      >
        <p className="font-devanagari text-2xl text-ochre">तराशय</p>
        <h3 className="mt-4 font-serif text-2xl text-heritage-brown">
          Your vision has been received.
        </h3>
        <p className="mt-6 text-sm text-heritage-brown/60">Save this reference:</p>
        <p className="mt-2 font-serif text-3xl text-ochre">{successRef}</p>
        <p className="mt-6 text-sm text-heritage-brown/70">
          Check your email for confirmation.
        </p>
        <Button
          asChild
          className="mt-8 bg-ochre text-off-white hover:bg-ochre/90"
        >
          <Link href="#track">Track your commission →</Link>
        </Button>
      </motion.div>
    );
  }

  const fieldClass =
    "w-full rounded-md border border-heritage-brown/20 bg-off-white px-3 py-2 font-sans text-sm text-heritage-brown focus:border-ochre focus:outline-none focus:ring-1 focus:ring-ochre";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-heritage-brown">
            Full Name <span className="text-ochre">*</span>
          </label>
          <Input
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="border-heritage-brown/20 bg-off-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-heritage-brown">
            Email <span className="text-ochre">*</span>
          </label>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="border-heritage-brown/20 bg-off-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-heritage-brown">Phone</label>
          <div className="flex gap-2">
            <select
              value={form.phoneCode}
              onChange={(e) => updateField("phoneCode", e.target.value)}
              className={`${fieldClass} w-28 shrink-0`}
            >
              {PHONE_CODES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code}
                </option>
              ))}
            </select>
            <Input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="border-heritage-brown/20 bg-off-white"
              placeholder="Phone number"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-heritage-brown">Country</label>
          <select
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
            className={fieldClass}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-heritage-brown">
          What would you like created? <span className="text-ochre">*</span>
        </label>
        <textarea
          required
          minLength={50}
          rows={5}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe your vision in as much detail as possible — size, style, occasion, who it's for..."
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-heritage-brown/50">
          {form.description.length}/50 minimum characters
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-heritage-brown">Category</label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className={fieldClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-heritage-brown">
            Preferred Artisan (optional)
          </label>
          <select
            value={form.preferredArtisan}
            onChange={(e) => updateField("preferredArtisan", e.target.value)}
            className={fieldClass}
          >
            <option value="auto">Let us choose the right artisan</option>
            {artisans.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name} — {a.specialization}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm text-heritage-brown">
          Budget Range <span className="text-ochre">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUDGET_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                form.budget === opt.value
                  ? "border-ochre bg-ochre/10"
                  : "border-heritage-brown/15 bg-off-white hover:border-ochre/50"
              }`}
            >
              <input
                type="radio"
                name="budget"
                value={opt.value}
                checked={form.budget === opt.value}
                onChange={() => updateField("budget", opt.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-heritage-brown">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-heritage-brown">
          Reference Images (optional, max 3)
        </label>
        {uploadEnabled === false ? (
          <p className="text-sm text-heritage-brown/60">Image upload coming soon</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {imageUrls.map((url, i) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Reference ${i + 1}`}
                  className="h-20 w-20 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute -right-2 -top-2 rounded-full bg-heritage-brown p-0.5 text-warm-beige"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {imageUrls.length < 3 && (
              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-heritage-brown/30 text-heritage-brown/50 hover:border-ochre">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm text-heritage-brown">
          How did you hear about us?
        </label>
        <select
          value={form.howHeard}
          onChange={(e) => updateField("howHeard", e.target.value)}
          className={fieldClass}
        >
          <option value="">Select...</option>
          {HOW_HEARD.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-ochre py-6 text-base text-off-white hover:bg-ochre/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send My Vision →"
        )}
      </Button>
    </form>
  );
}
