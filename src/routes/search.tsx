import { createFileRoute } from "@tanstack/react-router";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { store } from "@/lib/store";
import { searchProducts } from "@/lib/shop-state";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: () => ({
    meta: [
      { title: `${store.search.title} | ${store.pageTitleSuffix}` },
      { name: "description", content: store.search.metaDescription },
      { property: "og:title", content: `${store.search.title} | ${store.pageTitleSuffix}` },
      { property: "og:description", content: store.search.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchProducts(q);
  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <h1 className="mb-1 text-2xl font-bold">{store.search.title} "{q}"</h1>
        <p className="mb-6 text-sm text-muted-foreground">{results.length} {store.categoryPage.itemsCount}</p>
        {results.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{store.search.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </main>
    </StoreShell>
  );
}
