"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CommissionStatus,
  type ArtisanRef,
  type IArtisan,
  type ICommission,
} from "@/types";

interface CommissionRow extends Omit<ICommission, "assignedArtisan"> {
  assignedArtisan?: ArtisanRef;
}

export function AdminCommissionsPanel() {
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [artisans, setArtisans] = useState<IArtisan[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [progressModal, setProgressModal] = useState<string | null>(null);
  const [progressForm, setProgressForm] = useState<{
    status: CommissionStatus;
    note: string;
    photo: string;
  }>({
    status: CommissionStatus.CREATING,
    note: "",
    photo: "",
  });

  const load = useCallback(async () => {
    const [cRes, aRes] = await Promise.all([
      fetch("/api/commissions"),
      fetch("/api/artisans?all=true"),
    ]);
    const cJson = (await cRes.json()) as {
      success: boolean;
      data?: CommissionRow[];
    };
    const aJson = (await aRes.json()) as { success: boolean; data?: IArtisan[] };
    if (cJson.success && cJson.data) setCommissions(cJson.data);
    if (aJson.success && aJson.data) setArtisans(aJson.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateCommission(
    id: string,
    body: Record<string, unknown>
  ) {
    const res = await fetch(`/api/commissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { success: boolean; message?: string };
    if (json.success) {
      toast.success("Commission updated");
      setProgressModal(null);
      load();
    } else {
      toast.error(json.message ?? "Update failed");
    }
  }

  const filtered = statusFilter
    ? commissions.filter((c) => c.status === statusFilter)
    : commissions;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-heritage-brown">Commissions</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-heritage-brown/20 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {Object.values(CommissionStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {progressModal && (
        <div className="mt-6 rounded-lg border border-heritage-brown/10 bg-warm-beige/30 p-6">
          <h2 className="font-serif text-lg">Add Progress Update</h2>
          <div className="mt-4 space-y-3">
            <select
              value={progressForm.status}
              onChange={(e) =>
                setProgressForm({
                  ...progressForm,
                  status: e.target.value as CommissionStatus,
                })
              }
              className="w-full rounded border border-heritage-brown/20 px-3 py-2 text-sm"
            >
              {Object.values(CommissionStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Input
              placeholder="Note"
              value={progressForm.note}
              onChange={(e) =>
                setProgressForm({ ...progressForm, note: e.target.value })
              }
            />
            <Input
              placeholder="Photo URL (optional)"
              value={progressForm.photo}
              onChange={(e) =>
                setProgressForm({ ...progressForm, photo: e.target.value })
              }
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() =>
                updateCommission(progressModal, {
                  progressStatus: progressForm.status,
                  progressNote: progressForm.note,
                  progressPhoto: progressForm.photo || undefined,
                })
              }
              className="bg-heritage-brown text-warm-beige"
            >
              Save &amp; Email Buyer
            </Button>
            <Button variant="outline" onClick={() => setProgressModal(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-lg border border-heritage-brown/10">
        <table className="w-full text-sm">
          <thead className="bg-warm-beige/50">
            <tr>
              <th className="px-4 py-2 text-left">Ref</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Country</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Budget</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <Fragment key={c.referenceNumber}>
                <tr
                  className="cursor-pointer border-t border-heritage-brown/5 hover:bg-warm-beige/30"
                  onClick={() =>
                    setExpanded(
                      expanded === c.referenceNumber ? null : c.referenceNumber
                    )
                  }
                >
                  <td className="px-4 py-2 font-mono text-xs">{c.referenceNumber}</td>
                  <td className="px-4 py-2">{c.buyerContact.name}</td>
                  <td className="px-4 py-2">{c.buyerContact.email}</td>
                  <td className="px-4 py-2">{c.buyerContact.country}</td>
                  <td className="px-4 py-2">{c.category}</td>
                  <td className="px-4 py-2">
                    ₹{c.budget.min.toLocaleString("en-IN")}
                    {c.budget.max > 0
                      ? ` – ₹${c.budget.max.toLocaleString("en-IN")}`
                      : "+"}
                  </td>
                  <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) =>
                        updateCommission(String(c._id), {
                          status: e.target.value,
                        })
                      }
                      className="rounded border border-heritage-brown/20 px-2 py-1 text-xs"
                    >
                      {Object.values(CommissionStatus).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-heritage-brown/60">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
                {expanded === c.referenceNumber && (
                  <tr key={`${c.referenceNumber}-detail`}>
                    <td colSpan={8} className="bg-warm-beige/20 px-6 py-4">
                      <p className="text-sm text-heritage-brown/80">
                        {c.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div>
                          <label className="text-xs text-heritage-brown/60">
                            Assign Artisan
                          </label>
                          <select
                            value={
                              typeof c.assignedArtisan === "object"
                                ? c.assignedArtisan?._id ?? ""
                                : String(c.assignedArtisan ?? "")
                            }
                            onChange={(e) =>
                              updateCommission(String(c._id), {
                                assignedArtisan: e.target.value,
                              })
                            }
                            className="mt-1 block rounded border border-heritage-brown/20 px-3 py-2 text-sm"
                          >
                            <option value="">Unassigned</option>
                            {artisans.map((a) => (
                              <option key={a._id} value={a._id}>
                                {a.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          size="sm"
                          className="mt-5 bg-ochre text-off-white"
                          onClick={() => setProgressModal(String(c._id))}
                        >
                          Add Progress Update
                        </Button>
                      </div>
                      {c.progressUpdates.length > 0 && (
                        <ul className="mt-4 space-y-2 text-sm">
                          {c.progressUpdates.map((u, i) => (
                            <li key={i} className="border-l-2 border-gold pl-3">
                              <span className="text-xs text-heritage-brown/50">
                                {new Date(u.date).toLocaleDateString("en-IN")} ·{" "}
                                {u.status}
                              </span>
                              <p>{u.note}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
