import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import hero from "@/assets/hero-waffle.jpg";
import { categoriesQuery } from "@/services/categoryService";
import { productsQuery } from "@/services/productService";
import { categoryImages } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CapyWaffles — Waffles artesanales y pollo crujiente" },
      { name: "description", content: "Waffles artesanales, pollo crujiente, helados y refrescos. Descubre el menú de CapyWaffles." },
      { property: "og:title", content: "CapyWaffles — Waffles artesanales y pollo crujiente" },
      { property: "og:description", content: "Waffles, pollo crujiente, helados y refrescos en un solo lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(categoriesQuery), context.queryClient.ensureQueryData(productsQuery)]),
  component: Home,
});

function Home() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const heroImgRef = useRef<HTMLImageElement>(null);

  // El desplazamiento y el acercamiento mantienen el efecto visible en monitores grandes.
  useEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = img.parentElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const scroll = Math.min(rect.height, Math.max(0, -rect.top));
      const progress = scroll / rect.height;
      const distance = reducedMotion.matches ? 0 : scroll * 0.75;
      const scale = reducedMotion.matches ? 1.06 : 1.06 + progress * 0.24;
      img.style.transform = `translate3d(0, ${distance}px, 0) scale(${scale})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reducedMotion.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reducedMotion.removeEventListener("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-hero">
        <img
          ref={heroImgRef}
          src={hero}
          alt="Waffle artesanal con fresas, mantequilla y miel de maple"
          width={1600}
          height={1008}
          className="absolute inset-0 -z-10 h-full w-full object-cover will-change-transform"
          style={{ transform: "scale(1.06)" }}
        />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col justify-center px-5 py-20 text-hero-foreground">
          <p className="animate-rise mb-4 text-sm font-bold uppercase tracking-[0.3em] text-secondary">Crujiente · Dulce · Irresistible</p>
          <h1 className="animate-rise max-w-2xl text-5xl font-extrabold leading-[0.95] md:text-7xl [animation-delay:100ms]">
            Waffles & pollo <span className="text-primary">como nunca</span> antes.
          </h1>
          <p className="animate-rise mt-6 max-w-lg text-lg opacity-85 [animation-delay:200ms]">
            Waffles artesanales recién hechos, pollo crujiente y helados que te harán volver.
          </p>
          <div className="animate-rise mt-10 flex flex-wrap gap-4 [animation-delay:300ms]">
            <Link to="/menu" className="rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lift transition hover:-translate-y-0.5">Ver menú</Link>
            <a href="#destacados" className="rounded-full border-2 border-hero-foreground/60 px-8 py-4 font-bold text-hero-foreground transition hover:bg-hero-foreground hover:text-hero">Favoritos</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center text-4xl font-extrabold md:text-5xl">Explora el menú</h2>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} to="/menu" search={{ categoria: c.id }} className="group text-center">
              <div className="mx-auto aspect-square overflow-hidden rounded-full bg-card shadow-soft transition group-hover:-translate-y-1 group-hover:shadow-lift">
                <img src={categoryImages[c.id]} alt={c.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold group-hover:text-primary">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="destacados" className="bg-muted/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-extrabold md:text-5xl">Los favoritos</h2>
            <Link to="/menu" className="font-bold text-primary hover:underline">Ver todo →</Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section id="nosotros" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <img src={categoryImages[7]} alt="Waffle artesanal" loading="lazy" width={816} height={816} className="rounded-3xl shadow-lift" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Nuestra historia</p>
          <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Hecho a mano, servido con cariño.</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            En CapyWaffles preparamos cada waffle al momento y freímos nuestro pollo hasta lograr el crujido perfecto. Tranquilos como un capibara, intensos en sabor.
          </p>
        </div>
      </section>
    </>
  );
}
