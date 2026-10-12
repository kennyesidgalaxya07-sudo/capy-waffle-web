import waffles from "@/assets/cat-waffles.jpg";
import pollos from "@/assets/cat-pollos.jpg";
import helados from "@/assets/cat-helados.jpg";
import refrescos from "@/assets/cat-refrescos.jpg";
import type { Product } from "@/types";

export const categoryImages: Record<number, string> = { 7: waffles, 8: pollos, 9: helados, 10: refrescos };

/** Usa la imagen del producto si es una URL absoluta; si no, la de su categoría. */
export function productImage(p: Product): string {
  if (p.imageUrl && /^https?:\/\//.test(p.imageUrl)) return p.imageUrl;
  return categoryImages[p.categoryId] ?? waffles;
}

export const formatPrice = (n: number) => `$${Number(n).toFixed(2)}`;
