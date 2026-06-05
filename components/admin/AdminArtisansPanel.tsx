"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IArtisan } from "@/types";

const EMPTY: Partial<IArtisan> = {
  name: "",
  generation: 4,
  specialization: "",
  bio: "",
  story: "",
  yearsExperience: 0,
  totalPiecesCreated: 0,
  profilePhoto: "",
  workshopPhotos: [],
  awardsWon: [],
  featuredIn: [],
  isActive: true,
};

export function AdminArtisansPanel() {
  const [artisans, setArtisans] = useState<IArtisan[]>([]);
  const [editing, setEditing] = useState<Partial<IArtisan> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/artisans?all=true");
    const json = (await res.json()) as { success: boolean; data?: IArtisan[] };
    if (json.success && json.data) setArtisans(json.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!editing?.name) return;
    const isNew = !editing._id;
    const url = isNew ? "/api/artisans" : `/api/artisans/${editing.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const json = (await res.json()) as { success: boolean; message?: string };
    if (json.success) {
      toast.success(isNew ? "Artisan created" : "Artisan updated");
      setEditing(null);
      load();
    } else {
      toast.error(json.message ?? "Failed to save");
    }
  }

  async function toggleActive(artisan: IArtisan) {
    const res = await fetch(`/api/artisans/${artisan.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...artisan, isActive: !artisan.isActive }),
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
        <h1 className="font-serif text-3xl text-heritage-brown">Artisans</h1>
        <Button
          onClick={() => setEditing({ ...EMPTY })}
          className="bg-ochre text-off-white hover:bg-ochre/90"
        >
          Add Artisan
        </Button>
      </div>

      {editing && (
        <div className="mt-6 rounded-lg border border-heritage-brown/10 bg-warm-beige/30 p-6">
          <h2 className="font-serif text-lg">
            {editing._id ? "Edit Artisan" : "New Artisan"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["name", "Name"],
                ["specialization", "Specialization"],
                ["profilePhoto", "Photo URL"],
                ["bio", "Bio"],
                ["story", "Story"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-heritage-brown/60">{label}</label>
                <Input
                  value={String(editing[key] ?? "")}
                  onChange={(e) =>
                    setEditing({ ...editing, [key]: e.target.value })
                  }
                  className="mt-1 border-heritage-brown/20"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-heritage-brown/60">Generation</label>
              <Input
                type="number"
                value={editing.generation ?? 4}
                onChange={(e) =>
                  setEditing({ ...editing, generation: Number(e.target.value) })
                }
                className="mt-1 border-heritage-brown/20"
              />
            </div>
            <div>
              <label className="text-xs text-heritage-brown/60">Years Experience</label>
              <Input
                type="number"
                value={editing.yearsExperience ?? 0}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    yearsExperience: Number(e.target.value),
                  })
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
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Gen</th>
              <th className="px-4 py-2 text-left">Specialization</th>
              <th className="px-4 py-2 text-left">Pieces</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artisans.map((a) => (
              <tr key={a.slug} className="border-t border-heritage-brown/5">
                <td className="px-4 py-2">
                  {a.profilePhoto && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={a.profilePhoto} alt="" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2">{a.generation}</td>
                <td className="px-4 py-2">{a.specialization}</td>
                <td className="px-4 py-2">{a.totalPiecesCreated}</td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(a)}
                    className={`rounded px-2 py-0.5 text-xs ${
                      a.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {a.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(a)}
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
