import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { categoriesQuery } from "@/services/categoryService";
import { productsQuery } from "@/services/productService";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/menu")({
  validateSearch: z.object({ categoria: z.number().optional() }),
  head: () => ({
    meta: [
      { title: "Menú — CapyWaffles" },
      { name: "description", content: "Menú completo de CapyWaffles: waffles, pollos, helados y refrescos con precios." },
      { property: "og:title", content: "Menú — CapyWaffles" },
      { property: "og:description", content: "Waffles, pollos, helados y refrescos con precios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(categoriesQuery), context.queryClient.ensureQueryData(productsQuery)]),
  component: Menu,
});

function Menu() {
  const { categoria } = Route.useSearch();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const shown = categories.filter((c) => !categoria || c.id === categoria);
  const pill = "rounded-full px-5 py-2 text-sm font-bold transition border-2";

  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="text-5xl font-extrabold md:text-6xl">Nuestro menú</h1>
      <div className="sticky top-16 z-40 -mx-5 mt-8 flex gap-3 overflow-x-auto bg-background/90 px-5 py-4 backdrop-blur">
        <Link to="/menu" search={{}} className={`${pill} ${!categoria ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>Todo</Link>
        {categories.map((c) => (
          <Link key={c.id} to="/menu" search={{ categoria: c.id }} className={`${pill} ${categoria === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
            {c.name}
          </Link>
        ))}
      </div>
      {shown.map((c) => {
        const items = products.filter((p) => p.categoryId === c.id);
        return (
          <section key={c.id} className="mt-12">
            <h2 className="text-3xl font-extrabold">{c.name}</h2>
            <p className="text-muted-foreground">{c.description}</p>
            {items.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-muted p-8 text-center text-muted-foreground">Pronto tendremos productos aquí.</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
