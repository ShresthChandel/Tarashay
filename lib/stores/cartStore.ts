import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { CartItem, IProductPopulated } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: IProductPopulated) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, qty: number) => void;
  getTotalINR: () => number;
  getTotalUSD: () => number;
  itemCount: () => number;
}

function getProductId(product: IProductPopulated): string {
  return product._id ?? product.slug;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const id = getProductId(product);
        const existing = get().items.find(
          (i) => getProductId(i.product) === id
        );

        if (product.isOneOfAKind) {
          if (existing) {
            toast.info("This one-of-a-kind piece is already in your collection.");
            return;
          }
          set({ items: [...get().items, { product, quantity: 1 }] });
          toast.success(`${product.title} added to your collection.`);
          return;
        }

        if (existing) {
          set({
            items: get().items.map((i) =>
              getProductId(i.product) === id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] });
        }
        toast.success(`${product.title} added to your collection.`);
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(
            (i) => getProductId(i.product) !== productId
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      updateQuantity: (productId, qty) => {
        if (qty < 1) {
          get().removeItem(productId);
          return;
        }
        const item = get().items.find(
          (i) => getProductId(i.product) === productId
        );
        if (item?.product.isOneOfAKind && qty > 1) {
          toast.info("One-of-a-kind pieces are limited to a single quantity.");
          return;
        }
        set({
          items: get().items.map((i) =>
            getProductId(i.product) === productId
              ? { ...i, quantity: qty }
              : i
          ),
        });
      },

      getTotalINR: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price.INR * i.quantity,
          0
        ),

      getTotalUSD: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price.USD * i.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "tarashay-cart" }
  )
);
