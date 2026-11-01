import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Heart, Home, LayoutGrid, Menu, Search, ShoppingCart, User } from "lucide-react";
import { store } from "@/lib/store";
import { cartCount, shop, useShop } from "@/lib/shop-state";
import { SearchBox } from "@/components/store/SearchBox";
import { CartPanel, FavPanel } from "@/components/store/ShopPanels";
import { Toaster } from "@/components/ui/sonner";

const iconMap = { home: Home, heart: Heart, grid: LayoutGrid, user: User } as const;

function NavLink({ id, label, className, onClick }: { id: string; label: string; className: string; onClick?: () => void }) {
  const active = "font-semibold text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground";
  const inactive = "text-foreground/75 hover:text-foreground";
  if (id === "home")
    return (
      <Link to="/" onClick={onClick} className={className} activeOptions={{ exact: true }} activeProps={{ className: active }} inactiveProps={{ className: inactive }}>
        {label}
      </Link>
    );
  return (
    <Link to="/category/$categoryId" params={{ categoryId: id }} onClick={onClick} className={className} activeProps={{ className: active }} inactiveProps={{ className: inactive }}>
      {label}
    </Link>
  );
}

export function StoreShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, favs } = useShop();
  const count = cartCount(cart);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-20 font-sans text-foreground md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
          <Link to="/" className="shrink-0 font-brand text-2xl tracking-[0.25em] lg:text-3xl">
            {store.brand}
          </Link>

          <nav className="no-scrollbar hidden min-w-0 items-center gap-4 overflow-x-auto text-[13px] lg:flex xl:gap-7 xl:text-sm">
            {store.nav.map((n) => (
              <NavLink key={n.id} id={n.id} label={n.label} className="relative shrink-0 whitespace-nowrap py-2 transition-colors" />
            ))}
          </nav>

          <SearchBox className="ms-auto hidden min-w-28 flex-1 md:block md:max-w-64 lg:max-w-56 xl:max-w-72" />

          <div className="ms-auto flex shrink-0 items-center gap-4 md:ms-0">
            <User className="hidden h-5 w-5 md:block" />
            <button className="relative hidden md:block" aria-label={store.favorites.title} onClick={() => shop.openFav(true)}>
              <Heart className={`h-5 w-5 ${favs.length ? "fill-destructive text-destructive" : ""}`} />
            </button>
            <button className="relative" aria-label={store.cart.title} onClick={() => shop.openCart(true)}>
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground ring-2 ring-background">{count}</span>
            </button>
            <button className="lg:hidden" aria-label="القائمة" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>

        {menuOpen && (
          <nav className="flex flex-col border-t border-border px-4 py-2 lg:hidden">
            {store.nav.map((n) => (
              <NavLink key={n.id} id={n.id} label={n.label} onClick={() => setMenuOpen(false)} className="relative w-fit py-2 text-sm" />
            ))}
          </nav>
        )}
      </header>

      {children}

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background py-2 md:hidden">
        {store.bottomNav.map((b) => {
          const Icon = iconMap[b.icon as keyof typeof iconMap];
          const on = b.id === "home" ? path === "/" : b.id === "categories" ? path.startsWith("/category") : false;
          const cls = `flex flex-col items-center gap-1 text-[11px] ${on ? "text-foreground" : "text-muted-foreground"}`;
          const inner = (
            <>
              <Icon className={`h-5 w-5 ${on ? "fill-foreground" : ""}`} />
              {b.label}
            </>
          );
          if (b.id === "home") return <Link key={b.id} to="/" className={cls}>{inner}</Link>;
          if (b.id === "categories")
            return <Link key={b.id} to="/category/$categoryId" params={{ categoryId: "all" }} className={cls}>{inner}</Link>;
          if (b.id === "favorites") return <button key={b.id} onClick={() => shop.openFav(true)} className={cls}>{inner}</button>;
          return <button key={b.id} className={cls}>{inner}</button>;
        })}
      </nav>
      <CartPanel />
      <FavPanel />
      <Toaster position="top-center" />
    </div>
  );
}
