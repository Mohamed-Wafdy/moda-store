import { Heart, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { discountPercent, formatPrice, img, store, type Product } from "@/lib/store";
import { shop, useShop } from "@/lib/shop-state";

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-star text-star" : "text-border"}`} />
      ))}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { favs } = useShop();
  const fav = favs.includes(p.id);
  const off = discountPercent(p);
  const to = "/product/$productId" as const;
  const params = { productId: String(p.id) };

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Link to={to} params={params} className="block h-full w-full">
          <img
            src={img(p.image)}
            alt={p.name}
            loading="lazy"
            width={816}
            height={816}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          aria-label={fav ? store.favorites.remove : store.favorites.add}
          aria-pressed={fav}
          onClick={() => shop.toggleFav(p.id)}
          className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-soft"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
        </button>
        {(off > 0 || p.newArrival) && (
          <span className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[11px] text-primary-foreground">
            {off > 0 ? `${store.deals.discountLabel} ${off}%` : store.newArrivalLabel}
          </span>
        )}
      </div>
      <Link to={to} params={params}>
        <h3 className="mt-2 text-sm transition-colors hover:text-muted-foreground">{p.name}</h3>
      </Link>
      <p className="font-semibold">
        {formatPrice(p.price)}
        {p.oldPrice && (
          <span className="ms-2 text-xs font-normal text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span>
        )}
      </p>
      <Stars rating={p.rating} />
    </article>
  );
}
