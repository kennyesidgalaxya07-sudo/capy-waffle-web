import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { MapPin, Minus, Plus, Trash2 } from "lucide-react";
import { deliveryFee, distanceKm, STORE_LOCATION } from "@/lib/delivery";

const DeliveryMap = lazy(() => import("@/components/DeliveryMap"));
import { useCart } from "@/lib/cart";
import { formatPrice, productImage } from "@/lib/catalog";
import type { Product } from "@/types";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Tu carrito — CapyWaffles" },
      { name: "description", content: "Revisa los productos de tu pedido en CapyWaffles." },
      { property: "og:title", content: "Tu carrito — CapyWaffles" },
      { property: "og:description", content: "Revisa tu pedido de waffles, pollo y helados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, count, setQty, remove, clear } = useCart();
  const [km, setKm] = useState<number | null>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "error">("idle");
  const fee = km === null ? 0 : deliveryFee(km);

  const setLocation = (p: { lat: number; lng: number }, d: number) => {
    setPos(p);
    setKm(d);
  };

  const locate = () => {
    if (!navigator.geolocation) return setLocStatus("error");
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        setLocation(coords, distanceKm(STORE_LOCATION, coords));
        setLocStatus("idle");
      },
      () => setLocStatus("error"),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-5xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mt-4 text-muted-foreground">Agrega algo delicioso desde el menú.</p>
        <Link to="/menu" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lift">Ver menú</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="text-5xl font-extrabold">Tu carrito</h1>
        <ul className="mt-8 space-y-4">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
              <img src={productImage(i as unknown as Product)} alt={i.name} width={80} height={80} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-bold text-card-foreground">{i.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(i.price)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Quitar uno" onClick={() => setQty(i.id, i.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:border-primary"><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center font-bold">{i.quantity}</span>
                <button aria-label="Agregar uno" onClick={() => setQty(i.id, i.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:border-primary"><Plus className="h-4 w-4" /></button>
              </div>
              <span className="w-20 text-right font-display font-extrabold text-primary">{formatPrice(i.price * i.quantity)}</span>
              <button aria-label="Eliminar" onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-5 w-5" /></button>
            </li>
          ))}
        </ul>
        <button onClick={clear} className="mt-6 text-sm font-semibold text-muted-foreground hover:text-destructive">Vaciar carrito</button>
      </div>
      <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft lg:sticky lg:top-24">
        <h2 className="text-2xl font-extrabold">Resumen</h2>
        <div className="mt-4 flex justify-between text-muted-foreground"><span>Productos</span><span>{count}</span></div>
        <div className="mt-2 flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
        <div className="mt-2 flex justify-between text-muted-foreground">
          <span>Envío{km !== null && ` (${km.toFixed(1)} km)`}</span>
          <span>{km === null ? "—" : formatPrice(fee)}</span>
        </div>
        <button onClick={locate} disabled={locStatus === "loading"} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-bold hover:border-primary disabled:opacity-60">
          <MapPin className="h-4 w-4" />
          {locStatus === "loading" ? "Buscando tu ubicación…" : km === null ? "Usar mi ubicación" : "Actualizar ubicación"}
        </button>
        {locStatus === "error" && <p className="mt-2 text-xs text-destructive">No pudimos obtener tu ubicación. Revisa los permisos del navegador.</p>}
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <ClientOnly fallback={<div className="grid h-72 place-items-center text-sm text-muted-foreground">Cargando mapa…</div>}>
            <Suspense fallback={<div className="grid h-72 place-items-center text-sm text-muted-foreground">Cargando mapa…</div>}>
              <DeliveryMap position={pos} onChange={setLocation} />
            </Suspense>
          </ClientOnly>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Toca el mapa o arrastra el marcador rojo para indicar dónde entregamos. Envío: 1 por cada km desde nuestra tienda (Av. 10 #36, El Alto).</p>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-xl font-extrabold"><span>Total</span><span className="text-primary">{formatPrice(total + fee)}</span></div>
        <button className="mt-6 w-full rounded-full bg-primary py-4 font-bold text-primary-foreground shadow-lift transition hover:-translate-y-0.5" onClick={() => alert("¡Pedido recibido! Pronto habilitaremos el pago en línea.")}>
          Confirmar pedido
        </button>
      </aside>
    </div>
  );
}
