import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { allCategories, formatPrice, img, store } from "@/lib/store";
import { searchProducts } from "@/lib/shop-state";

export function SearchBox({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const t = q.trim().toLowerCase();
  const cats = t ? allCategories.filter((c) => c.label.toLowerCase().includes(t)).slice(0, 3) : [];
  const prods = searchProducts(q).slice(0, 5);
  const s = store.search;
  const close = () => {
    setOpen(false);
    setQ("");
  };

  return (
    <form
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (!t) return;
        navigate({ to: "/search", search: { q: q.trim() } });
        close();
      }}
    >
      <label className="flex h-10 items-center gap-2 rounded-full bg-muted px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={store.searchPlaceholder}
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>
      {open && t && (
        <div className="absolute inset-x-0 top-12 z-50 max-h-96 overflow-y-auto rounded-xl border border-border bg-background p-2 shadow-soft">
          {cats.length === 0 && prods.length === 0 && <p className="p-3 text-sm text-muted-foreground">{s.noResults}</p>}
          {cats.length > 0 && (
            <>
              <p className="px-2 py-1 text-xs text-muted-foreground">{s.suggestionsCategories}</p>
              {cats.map((c) => (
                <Link key={c.id} to="/category/$categoryId" params={{ categoryId: c.id }} onClick={close} className="block rounded-lg px-2 py-2 text-sm hover:bg-muted">
                  {c.label}
                </Link>
              ))}
            </>
          )}
          {prods.length > 0 && (
            <>
              <p className="px-2 py-1 text-xs text-muted-foreground">{s.suggestionsProducts}</p>
              {prods.map((p) => (
                <Link key={p.id} to="/search" search={{ q: p.name }} onClick={close} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted">
                  <img src={img(p.image)} alt={p.name} width={40} height={40} className="h-10 w-10 rounded-md object-cover" />
                  <span className="flex-1 text-sm">{p.name}</span>
                  <span className="text-xs font-semibold">{formatPrice(p.price)}</span>
                </Link>
              ))}
              <button type="submit" className="mt-1 w-full rounded-lg px-2 py-2 text-sm font-semibold hover:bg-muted">{s.seeAll}</button>
            </>
          )}
        </div>
      )}
    </form>
  );
}
