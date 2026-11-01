import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Banknote, ChevronLeft, ChevronRight, Headphones, RotateCcw, Truck } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard, Stars } from "@/components/store/ProductCard";
import { img, newArrivals, deals, productsIn, store } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MODA | متجر الأزياء العصرية" },
      { name: "description", content: "تسوق أحدث الملابس الرجالية والنسائية والأحذية والإكسسوارات من MODA." },
      { property: "og:title", content: "MODA | متجر الأزياء العصرية" },
      { property: "og:description", content: "تسوق أحدث الملابس والأحذية والإكسسوارات من MODA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const serviceIcons = { truck: Truck, return: RotateCcw, payment: Banknote, support: Headphones } as const;

function SectionTitle({ children, link }: { children: React.ReactNode; link?: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold sm:text-2xl">{children}</h2>
      {link && (
        <Link to="/category/$categoryId" params={{ categoryId: "all" }} className="text-sm text-muted-foreground hover:text-foreground">
          {store.viewAll}
        </Link>
      )}
    </div>
  );
}

function Index() {
  const [slide, setSlide] = useState(0);
  const total = store.hero.length;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  const bestSellers = productsIn("all").slice(0, 12);

  return (
    <StoreShell>
      <section className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80 lg:h-96">
        {store.hero.map((h, i) => (
          <img
            key={h.id}
            src={img(h.image)}
            alt={h.alt}
            width={1920}
            height={1200}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <button
          aria-label="السابق"
          onClick={() => setSlide((s) => (s - 1 + total) % total)}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-soft backdrop-blur-sm transition-colors hover:bg-background"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          aria-label="التالي"
          onClick={() => setSlide((s) => (s + 1) % total)}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-soft backdrop-blur-sm transition-colors hover:bg-background"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {store.hero.map((h, i) => (
            <span key={h.id} className={`h-1.5 rounded-full bg-background transition-all ${i === slide ? "w-5" : "w-1.5 opacity-60"}`} />
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-7xl lg:px-8">
        <section className="no-scrollbar flex gap-4 overflow-x-auto px-4 py-6 sm:justify-center sm:gap-8 lg:gap-12">
          {store.categories.map((c) => (
            <Link key={c.id} to="/category/$categoryId" params={{ categoryId: c.id }} className="flex shrink-0 flex-col items-center gap-2">
              <span className="h-16 w-16 overflow-hidden rounded-full bg-muted sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                <img src={img(c.image)} alt={c.label} loading="lazy" width={816} height={816} className="h-full w-full object-cover" />
              </span>
              <span className="text-xs sm:text-sm">{c.label}</span>
            </Link>
          ))}
        </section>

        <section className="px-4 pb-10">
          <SectionTitle link>{store.bestSellersTitle}</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {bestSellers.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {newArrivals.length > 0 && (
          <section className="border-t border-border px-4 py-10">
            <SectionTitle link>{store.newArrivalsTitle}</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {newArrivals.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {deals.length > 0 && (
          <section className="border-t border-border bg-muted/40 px-4 py-10">
            <SectionTitle link>{store.deals.title}</SectionTitle>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
              {deals.map((p) => (
                <div key={p.id} className="w-40 shrink-0 sm:w-auto">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-border px-4 py-10">
          <SectionTitle>{store.services.title}</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {store.services.items.map((s) => {
              const Icon = serviceIcons[s.icon as keyof typeof serviceIcons] ?? Truck;
              return (
                <div key={s.title} className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="text-xs leading-6 text-muted-foreground">{s.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border px-4 py-10">
          <SectionTitle>{store.testimonials.title}</SectionTitle>
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {store.testimonials.items.map((t) => (
              <figure key={t.name} className="flex h-full flex-col gap-3 rounded-xl border border-border p-4">
                <Stars rating={t.rating} />
                <blockquote className="flex-1 text-sm leading-7 text-muted-foreground">“{t.text}”</blockquote>
                <figcaption className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {t.name.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold">{t.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </StoreShell>
  );
}
