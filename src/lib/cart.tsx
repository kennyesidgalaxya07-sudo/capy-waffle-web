import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/types";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "capy-cart";

export function cartTotal(items: CartItem[]): number {
  return Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch (e) {
      console.error("[Cart] No se pudo leer el carrito", e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = (p: Product) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { id: p.id, name: p.name, price: Number(p.price), categoryId: p.categoryId, imageUrl: p.imageUrl, quantity: 1 }];
    });
  const setQty = (id: number, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))));
  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  return <Ctx.Provider value={{ items, count, total: cartTotal(items), add, setQty, remove, clear }}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart debe usarse dentro de CartProvider");
  return c;
}
