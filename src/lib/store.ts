import store from "@/data/store.json";

const imageModules = import.meta.glob("../assets/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const images: Record<string, string> = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [path.split("/").pop()!.replace(".jpg", ""), url]),
);
export const img = (key: string) => images[key];
export const formatPrice = (p: number) => `${p.toLocaleString("en-US")} ${store.currency}`;

export type Product = (typeof store.products)[number];

/** Every browsable category: top-bar items (except home) plus category circles, de-duplicated. */
export const allCategories: { id: string; label: string }[] = [
  ...store.nav.filter((n) => n.id !== "home"),
  ...store.categories,
].filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i).map(({ id, label }) => ({ id, label }));

export const categoryLabel = (id: string) => allCategories.find((c) => c.id === id)?.label;

export const productsIn = (id: string) =>
  id === "all" ? store.products : store.products.filter((p) => p.categories.includes(id));

export const productById = (id: number) => store.products.find((p) => p.id === id);

export const newArrivals = store.products.filter((p) => p.newArrival);

export const deals = store.products.filter((p) => p.oldPrice !== null);

/** Whole-percent discount of a product, 0 when it carries no old price. */
export const discountPercent = (p: Product) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

/** Same-category products, nearest rating first, excluding the product itself. */
export const relatedProducts = (p: Product, limit = 4) =>
  store.products
    .filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

export { store };
