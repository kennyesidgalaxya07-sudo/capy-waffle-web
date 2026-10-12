import { Link } from "@tanstack/react-router";
import { Moon, ShoppingBag, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

function CartLink() {
  const { count } = useCart();
  return (
    <Link to="/carrito" aria-label="Ver carrito" className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition hover:scale-105 hover:border-primary">
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">{count}</span>
      )}
    </Link>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition hover:scale-105 hover:border-primary"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export function Navbar() {
  const link = "text-sm font-semibold uppercase tracking-wide text-foreground/80 transition hover:text-primary";
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="font-display text-2xl font-extrabold text-primary">
          Capy<span className="text-foreground">Waffles</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className={link} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>Inicio</Link>
          <Link to="/menu" className={link} activeProps={{ className: "text-primary" }}>Menú</Link>
          <a href="/#nosotros" className={link}>Nosotros</a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CartLink />
          <Link to="/menu" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            Pedir ahora
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-hero py-12 text-hero-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 md:flex-row">
        <p className="font-display text-xl font-extrabold">CapyWaffles</p>
        <p className="text-sm opacity-70">Waffles artesanales · Pollo crujiente · Helados · Refrescos</p>
        <p className="text-sm opacity-50">© {new Date().getFullYear()} CapyWaffles</p>
      </div>
    </footer>
  );
}
