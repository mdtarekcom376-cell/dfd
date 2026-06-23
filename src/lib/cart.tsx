import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./sanityClient";
import { effectivePrice } from "./whatsapp";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { product, qty }];
    });
    setOpen(true);
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.product._id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.product._id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  const clear = () => setItems([]);

  const { total, count } = useMemo(() => {
    let total = 0;
    let count = 0;
    for (const i of items) {
      total += effectivePrice(i.product) * i.qty;
      count += i.qty;
    }
    return { total, count };
  }, [items]);

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, remove, setQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
