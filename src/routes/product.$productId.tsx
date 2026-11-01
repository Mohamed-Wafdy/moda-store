import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard, Stars } from "@/components/store/ProductCard";
import {
  categoryLabel,
  discountPercent,
  formatPrice,
  img,
  productById,
  relatedProducts,
  store,
} from "@/lib/store";
import { shop, useShop } from "@/lib/shop-state";

const pp = store.productPage;

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    const p = productById(Number(params.productId));
    const title = p ? `${p.name} | ${store.pageTitleSuffix}` : `${pp.notFound} | ${store.pageTitleSuffix}`;
    const description = p ? p.description : pp.notFound;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const p = productById(Number(productId));
  const [qty, setQty] = useState(1);
  const { favs } = useShop();

  if (!p)
    return (
      <StoreShell>
        <main className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
          <p className="mb-4 text-lg">{pp.notFound}</p>
          <Link to="/" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
            {pp.backHome}
          </Link>
        </main>
      </StoreShell>
    );

  const fav = favs.includes(p.id);
  const off = discountPercent(p);
  const related = relatedProducts(p);

  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          {pp.backHome}
        </Link>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <img
              src={img(p.image)}
              alt={p.name}
              width={816}
              height={816}
              className="h-full w-full object-cover"
            />
            {off > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                {store.deals.discountLabel} {off}%
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>

            <div className="mt-2 flex items-center gap-3">
              <Stars rating={p.rating} />
              <span className="text-sm text-muted-foreground">{p.rating} / 5</span>
            </div>

            <p className="mt-4 flex flex-wrap items-baseline gap-3 text-2xl font-bold">
              {formatPrice(p.price)}
              {p.oldPrice && (
                <span className="text-base font-normal text-muted-foreground line-through">
                  {formatPrice(p.oldPrice)}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{pp.inStock}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">{pp.qtyLabel}</span>
                <button
                  aria-label="-"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center font-semibold">{qty}</span>
                <button
                  aria-label="+"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  shop.add(p.id, qty);
                  toast.success(store.cart.added, { description: p.name });
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90 sm:flex-none"
              >
                <ShoppingCart className="h-4 w-4" />
                {store.cart.addToCart}
              </button>

              <button
                aria-label={fav ? store.favorites.remove : store.favorites.add}
                aria-pressed={fav}
                onClick={() => shop.toggleFav(p.id)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
              >
                <Heart className={`h-5 w-5 ${fav ? "fill-destructive text-destructive" : ""}`} />
              </button>
            </div>

            <section className="mt-7 border-t border-border pt-5">
              <h2 className="mb-2 font-semibold">{pp.descriptionTitle}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{p.description}</p>
            </section>

            <section className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5 text-sm">
              <span className="text-muted-foreground">{pp.categoryLabel}:</span>
              {p.categories.map((c) => (
                <Link
                  key={c}
                  to="/category/$categoryId"
                  params={{ categoryId: c }}
                  className="rounded-full border border-border px-3 py-1 hover:border-foreground"
                >
                  {categoryLabel(c) ?? c}
                </Link>
              ))}
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-10 border-t border-border pt-6">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">{pp.relatedTitle}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </section>
        )}
      </main>
    </StoreShell>
  );
}
