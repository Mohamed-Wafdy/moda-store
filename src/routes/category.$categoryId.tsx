import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { allCategories, categoryLabel, productsIn, store } from "@/lib/store";

const cp = store.categoryPage;
const labelFor = (id: string) => (id === "all" ? cp.allLabel : categoryLabel(id));

export const Route = createFileRoute("/category/$categoryId")({
  head: ({ params }) => {
    const label = labelFor(params.categoryId) ?? cp.notFound;
    const title = `${label} | ${store.pageTitleSuffix}`;
    const description = `${cp.metaDescription} ${label}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const [sort, setSort] = useState(cp.sorts[0]?.id ?? "");
  const label = labelFor(categoryId);

  const products = useMemo(() => {
    const list = [...productsIn(categoryId)];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [categoryId, sort]);

  const chips = [{ id: "all", label: cp.allLabel }, ...allCategories.filter((c) => c.id !== "all")];

  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {!label ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg">{cp.notFound}</p>
            <Link to="/" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">{cp.backHome}</Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{label}</h1>
                <p className="text-sm text-muted-foreground">{products.length} {cp.itemsCount}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{cp.sortLabel}</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-border bg-background px-3 py-2">
                  {cp.sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </div>

            <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
              {chips.map((c) => (
                <Link
                  key={c.id}
                  to="/category/$categoryId"
                  params={{ categoryId: c.id }}
                  className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors"
                  activeProps={{ className: "bg-primary text-primary-foreground" }}
                  inactiveProps={{ className: "border border-border bg-background" }}
                >
                  {c.label}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <p className="py-16 text-center text-muted-foreground">{cp.empty}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {products.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </>
        )}
      </main>
    </StoreShell>
  );
}
