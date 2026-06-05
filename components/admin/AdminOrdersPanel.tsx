"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatus, type IOrder } from "@/types";

interface OrderRow extends IOrder {
  _id: string;
}

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [trackingEdits, setTrackingEdits] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    const json = (await res.json()) as { success: boolean; data?: OrderRow[] };
    if (json.success && json.data) setOrders(json.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateOrder(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { success: boolean; message?: string };
    if (json.success) {
      toast.success("Order updated");
      load();
    } else {
      toast.error(json.message ?? "Update failed");
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-heritage-brown">Orders</h1>

      <div className="mt-8 overflow-x-auto rounded-lg border border-heritage-brown/10">
        <table className="w-full text-sm">
          <thead className="bg-warm-beige/50">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Buyer</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Payment</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <Fragment key={String(o._id)}>
                <tr
                  className="cursor-pointer border-t border-heritage-brown/5 hover:bg-warm-beige/30"
                  onClick={() =>
                    setExpanded(expanded === String(o._id) ? null : String(o._id))
                  }
                >
                  <td className="px-4 py-2 font-mono text-xs">
                    {String(o._id).slice(-8)}
                  </td>
                  <td className="px-4 py-2">
                    {o.guestName ?? o.shippingAddress?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2">{o.items?.length ?? 0}</td>
                  <td className="px-4 py-2">
                    ₹{o.totalINR?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2 capitalize">{o.paymentStatus}</td>
                  <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.orderStatus}
                      onChange={(e) =>
                        updateOrder(String(o._id), {
                          orderStatus: e.target.value,
                        })
                      }
                      className="rounded border border-heritage-brown/20 px-2 py-1 text-xs"
                    >
                      {Object.values(OrderStatus).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-heritage-brown/60">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
                {expanded === String(o._id) && (
                  <tr>
                    <td colSpan={7} className="bg-warm-beige/20 px-6 py-4">
                      <p className="text-sm">
                        <strong>Email:</strong> {o.guestEmail ?? "—"}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong>Shipping:</strong>{" "}
                        {o.shippingAddress?.line1}, {o.shippingAddress?.city},{" "}
                        {o.shippingAddress?.country}
                      </p>
                      <div className="mt-4 flex items-end gap-2">
                        <div>
                          <label className="text-xs text-heritage-brown/60">
                            Tracking ID
                          </label>
                          <Input
                            value={
                              trackingEdits[String(o._id)] ??
                              o.trackingId ??
                              ""
                            }
                            onChange={(e) =>
                              setTrackingEdits({
                                ...trackingEdits,
                                [String(o._id)]: e.target.value,
                              })
                            }
                            className="mt-1 border-heritage-brown/20"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateOrder(String(o._id), {
                              trackingId:
                                trackingEdits[String(o._id)] ?? o.trackingId,
                            })
                          }
                        >
                          Save Tracking
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-heritage-brown/50"
                >
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
