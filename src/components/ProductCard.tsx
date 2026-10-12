import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice, productImage } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

function AddButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        add(product);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      className={`rounded-full border-2 border-primary px-4 py-1.5 text-sm font-bold transition ${done ? "bg-primary text-primary-foreground" : "text-primary hover:bg-primary hover:text-primary-foreground"}`}
    >
      {done ? "¡Listo!" : "Agregar"}
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={productImage(product)}
          alt={product.name}
          loading="lazy"
          width={816}
          height={816}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.isPromotion && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">Promo</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold leading-tight text-card-foreground">{product.name}</h3>
        {product.description && <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-2xl font-extrabold text-primary">{formatPrice(product.price)}</span>
          <AddButton product={product} />
        </div>
      </div>
    </article>
  );
}
