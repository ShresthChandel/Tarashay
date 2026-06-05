"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/lib/countries";
import type { ShippingAddress } from "@/types";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
}

const STEPS = ["Cart Review", "Shipping Details", "Payment"] as const;

function getProductId(product: { _id?: string; slug: string }): string {
  return product._id ?? product.slug;
}

export function CheckoutFlow() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalINR, clearCart } =
    useCartStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState<ShippingAddress & { email: string; phone: string }>({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  useEffect(() => {
    if (items.length === 0 && step === 0) {
      router.replace("/shop");
    }
  }, [items.length, step, router]);

  async function createOrderAndPay() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: getProductId(i.product),
            quantity: i.quantity,
          })),
          guestEmail: shipping.email,
          guestName: shipping.name,
          paymentMethod: shipping.country === "India" ? "razorpay" : "stripe",
          shippingAddress: {
            name: shipping.name,
            line1: shipping.line1,
            line2: shipping.line2,
            city: shipping.city,
            state: shipping.state,
            country: shipping.country,
            pincode: shipping.pincode,
          },
        }),
      });

      const json = (await res.json()) as {
        success: boolean;
        data?: {
          orderId: string;
          razorpayOrderId?: string;
          razorpayKeyId?: string | null;
          totalINR: number;
        };
        message?: string;
      };

      if (!json.success || !json.data) {
        toast.error(json.message ?? "Failed to create order");
        return;
      }

      const { orderId, razorpayOrderId, razorpayKeyId, totalINR } = json.data;

      if (shipping.country !== "India") {
        toast.info("International payments coming soon");
        return;
      }

      if (!razorpayKeyId || !razorpayOrderId || !window.Razorpay) {
        toast.error("Payment gateway not configured");
        return;
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: totalINR * 100,
        currency: "INR",
        name: "तराशय — Tarashay",
        description: "Rewa Supari Art",
        order_id: razorpayOrderId,
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: { color: "#3D2B1F" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/webhooks/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyJson = (await verifyRes.json()) as { success: boolean };
          if (verifyJson.success) {
            clearCart();
            toast.success("Payment successful! Order confirmed.");
            router.push("/shop");
          } else {
            toast.error("Payment verification failed");
          }
        },
      });
      rzp.open();
    } catch {
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ochre" />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10 flex gap-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex-1 border-b-2 pb-2 text-center text-sm ${
                i <= step
                  ? "border-ochre text-heritage-brown"
                  : "border-heritage-brown/10 text-heritage-brown/40"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 className="font-serif text-2xl text-heritage-brown">Your Collection</h2>
            <ul className="mt-6 space-y-4">
              {items.map((item) => {
                const id = getProductId(item.product);
                return (
                  <li
                    key={id}
                    className="flex gap-4 rounded-lg border border-heritage-brown/10 p-4"
                  >
                    {item.product.photos?.[0] && (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
                        <Image
                          src={item.product.photos[0]}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-serif text-heritage-brown">
                        {item.product.title}
                      </p>
                      <p className="text-sm text-heritage-brown/60">
                        ₹{item.product.price.INR.toLocaleString("en-IN")}
                      </p>
                      {!item.product.isOneOfAKind && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(id, item.quantity - 1)
                            }
                            className="h-6 w-6 rounded border text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(id, item.quantity + 1)
                            }
                            className="h-6 w-6 rounded border text-sm"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(id)}
                      className="text-heritage-brown/40 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-right font-serif text-xl text-heritage-brown">
              Total: ₹{getTotalINR().toLocaleString("en-IN")}
            </p>
            <Button
              className="mt-6 w-full bg-ochre text-off-white hover:bg-ochre/90"
              onClick={() => setStep(1)}
            >
              Continue to Shipping →
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl text-heritage-brown">
              Shipping Details
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Full Name", "text"],
                  ["email", "Email", "email"],
                  ["phone", "Phone", "tel"],
                  ["line1", "Address Line 1", "text"],
                  ["line2", "Address Line 2", "text"],
                  ["city", "City", "text"],
                  ["state", "State", "text"],
                  ["pincode", "PIN Code", "text"],
                ] as const
              ).map(([key, label, type]) => (
                <div key={key} className={key === "line1" ? "sm:col-span-2" : ""}>
                  <label className="text-sm text-heritage-brown/70">{label}</label>
                  <Input
                    required={key !== "line2"}
                    type={type}
                    value={shipping[key]}
                    onChange={(e) =>
                      setShipping({ ...shipping, [key]: e.target.value })
                    }
                    className="mt-1 border-heritage-brown/20"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm text-heritage-brown/70">Country</label>
                <select
                  value={shipping.country}
                  onChange={(e) =>
                    setShipping({ ...shipping, country: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-heritage-brown/20 px-3 py-2 text-sm"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-ochre text-off-white hover:bg-ochre/90"
                onClick={() => setStep(2)}
              >
                Continue to Payment →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl text-heritage-brown">Payment</h2>
            <p className="mt-4 font-serif text-3xl text-ochre">
              ₹{getTotalINR().toLocaleString("en-IN")}
            </p>
            {shipping.country === "India" ? (
              <Button
                disabled={loading}
                className="mt-8 w-full bg-heritage-brown py-6 text-warm-beige hover:bg-heritage-brown/90"
                onClick={createOrderAndPay}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Pay with Razorpay"
                )}
              </Button>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed border-heritage-brown/20 p-8 text-center text-heritage-brown/60">
                International payments coming soon
              </div>
            )}
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
