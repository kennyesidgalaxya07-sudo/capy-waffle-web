<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# CapyWaffles — Contexto del agente

## Proyecto
Sitio web de CapyWaffles (waffles artesanales, pollo crujiente, helados, refrescos). Público: clientes que consultan el menú. Inspiración visual: bbqchicken.com.

## Stack
TanStack Start v1 (React 19, Vite 7, SSR) — se usa en lugar de Next.js porque es el framework fijo de la plataforma. TypeScript, Tailwind CSS v4 (`src/styles.css`), TanStack Query, Supabase JS (`@supabase/supabase-js`), lucide-react.

## Estructura
```
src/
  routes/            # __root (Navbar+Footer+tema), index (inicio), menu (?categoria=id)
  components/        # Navbar (+ThemeToggle, Footer), ProductCard
  services/          # configService, categoryService, productService (+queryOptions)
  lib/database/      # supabaseClient, databaseService (CRUD genérico)
  lib/catalog.ts     # imágenes de categoría y formato de precio
  types/index.ts     # Category, Product, ProductIngredientDetail, ProductDetailProduct
  assets/            # imágenes generadas
```

## Comandos
`bun install` · `bun run dev` · `bun run build` · `bun run lint` · `bunx vitest run`

## Convenciones
- Componentes PascalCase, servicios camelCase. Tipos estrictos en todas las respuestas.
- Errores: try/catch + `console.error("[DatabaseService] ...")` y re-lanzar.
- Lectura de datos: loader `ensureQueryData(xQuery)` + `useSuspenseQuery(xQuery)`.

## Datos (Supabase externo)
- Credenciales en `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_GROUP_ID` (CapyWaffles = 2). Clave publicable, sin sesión persistida (seguro en SSR).
- `DatabaseService<T>` filtra `state = true` y `groupId` cuando aplica. Métodos: getAll, getById, getByField, create, update, delete, searchByField.
- Tablas: `categories`, `products`, `product_ingredient_details`, `product_detail_products`.
- `imageUrl` de productos suele ser ruta relativa no disponible → se usa la imagen de la categoría.

## Diseño
Tokens oklch en `src/styles.css` (rojo primario, ámbar secundario, crema de fondo; `--hero` oscuro). Fuentes: Bricolage Grotesque (títulos) + Figtree (texto). Modo oscuro: clase `.dark` en `<html>`, guardada en localStorage `theme`, aplicada por script inline en el head.

## Reglas de negocio
Categorías fijas: Waffles (7), Pollos (8), Helados (9), Refrescos (10). Precios en $ con 2 decimales. Solo se muestran productos con `isAvailable`. Destacados = `isFeatured`.

## TODOs
- Carrito / pedidos ("Agregar" aún sin acción).
- Productos de Refrescos (no hay filas en la base).
- Subir imágenes reales de productos al Storage.
