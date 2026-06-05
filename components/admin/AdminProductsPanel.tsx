"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductStatus, type IArtisan, type IProductPopulated } from "@/types";

export function AdminProductsPanel() {
  const [products, setProducts] = useState<IProductPopulated[]>([]);
  const [artisans, setArtisans] = useState<IArtisan[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [pRes, aRes] = await Promise.all([
      fetch("/api/products?status=all"),
      fetch("/api/artisans?all=true"),
    ]);
    const pJson = (await pRes.json()) as {
      success: boolean;
      data?: IProductPopulated[];
    };
    const aJson = (await aRes.json()) as { success: boolean; data?: IArtisan[] };
    if (pJson.success && pJson.data) setProducts(pJson.data);
    if (aJson.success && aJson.data) setArtisans(aJson.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!editing) return;
    const isNew = !editing.slug;
    const url = isNew ? "/api/products" : `/api/products/${editing.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const json = (await res.json()) as { success: boolean; message?: string };
    if (json.success) {
      toast.success(isNew ? "Product created" : "Product updated");
      setEditing(null);
      load();
    } else {
      toast.error(json.message ?? "Failed to save");
    }
  }

  async function updateStatus(slug: string, status: string) {
    const res = await fetch(`/api/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = (await res.json()) as { success: boolean };
    if (json.success) {
      toast.success("Status updated");
      load();
    }
  }

  if (loading) return <p className="text-heritage-brown/50">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-heritage-brown">Products</h1>
        <Button
          onClick={() =>
            setEditing({
              title: "",
              artisan: artisans[0]?._id ?? "",
              category: "ganesh-idol",
              story: "",
              hoursToCreate: 100,
              rawMaterialGrams: 500,
              height: 20,
              width: 15,
              depth: 10,
              weight: 1,
              priceINR: 10000,
              priceUSD: 120,
              photos: [],
              status: ProductStatus.AVAILABLE,
            })
          }
          className="bg-ochre text-off-white hover:bg-ochre/90"
        >
          Add Product
        </Button>
      </div>

      {editing && (
        <div className="mt-6 rounded-lg border border-heritage-brown/10 bg-warm-beige/30 p-6">
          <h2 className="font-serif text-lg">
            {editing.slug ? "Edit Product" : "New Product"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["title", "Title"],
                ["story", "Story"],
                ["photos", "Photo URLs (comma-separated)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={key === "story" ? "sm:col-span-2" : ""}>
                <label className="text-xs text-heritage-brown/60">{label}</label>
                <Input
                  value={
                    key === "photos"
                      ? Array.isArray(editing.photos)
                        ? (editing.photos as string[]).join(", ")
                        : String(editing.photos ?? "")
                      : String(editing[key] ?? "")
                  }
                  onChange={(e) => {
                    if (key === "photos") {
                      setEditing({
                        ...editing,
                        photos: e.target.value.split(",").map((s) => s.trim()),
                      });
                    } else {
                      setEditing({ ...editing, [key]: e.target.value });
                    }
                  }}
                  className="mt-1 border-heritage-brown/20"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-heritage-brown/60">Artisan</label>
              <select
                value={String(editing.artisan ?? "")}
                onChange={(e) => setEditing({ ...editing, artisan: e.target.value })}
                className="mt-1 w-full rounded-md border border-heritage-brown/20 px-3 py-2 text-sm"
              >
                {artisans.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-heritage-brown/60">Price INR</label>
              <Input
                type="number"
                value={Number(editing.priceINR ?? 0)}
                onChange={(e) =>
                  setEditing({ ...editing, priceINR: Number(e.target.value) })
                }
                className="mt-1 border-heritage-brown/20"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} className="bg-heritage-brown text-warm-beige">
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-lg border border-heritage-brown/10">
        <table className="w-full text-sm">
          <thead className="bg-warm-beige/50">
            <tr>
              <th className="px-4 py-2 text-left">Photo</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Artisan</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Hours</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-t border-heritage-brown/5">
                <td className="px-4 py-2">
                  {p.photos?.[0] && (
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image src={p.photos[0]} alt="" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">{p.artisan?.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.slug, e.target.value)}
                    className="rounded border border-heritage-brown/20 px-2 py-1 text-xs"
                  >
                    {Object.values(ProductStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">₹{p.price.INR.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2">{p.hoursToCreate}</td>
                <td className="px-4 py-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditing({
                        ...p,
                        artisan: p.artisan?._id ?? p.artisan,
                        priceINR: p.price.INR,
                        priceUSD: p.price.USD,
                        height: p.dimensions.height,
                        width: p.dimensions.width,
                        depth: p.dimensions.depth,
                      })
                    }
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
