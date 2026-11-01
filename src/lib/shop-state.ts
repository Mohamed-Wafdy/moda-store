import { useSyncExternalStore } from "react";
import { store } from "@/lib/store";

type State = { cart: Record<number, number>; favs: number[]; cartOpen: boolean; favOpen: boolean };
const KEY = "moda-shop";
let state: State = { cart: {}, favs: [], cartOpen: false, favOpen: false };
let loaded = false;
const listeners = new Set<() => void>();
const serverState = state;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}");
    state = { ...state, cart: s.cart ?? {}, favs: s.favs ?? [] };
  } catch {
    /* ignore */
  }
}
function set(next: Partial<State>) {
  state = { ...state, ...next };
  localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, favs: state.favs }));
  listeners.forEach((l) => l());
}

export function useShop() {
  const s = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      if (!loaded) {
        load();
        l();
      }
      return () => listeners.delete(l);
    },
    () => state,
    () => serverState,
  );
  return s;
}

export const shop = {
  add: (id: number, qty = 1) => set({ cart: { ...state.cart, [id]: (state.cart[id] ?? 0) + qty } }),
  setQty: (id: number, q: number) => {
    const cart = { ...state.cart };
    if (q <= 0) delete cart[id];
    else cart[id] = q;
    set({ cart });
  },
  toggleFav: (id: number) =>
    set({ favs: state.favs.includes(id) ? state.favs.filter((x) => x !== id) : [...state.favs, id] }),
  openCart: (o: boolean) => set({ cartOpen: o }),
  openFav: (o: boolean) => set({ favOpen: o }),
};

export const cartLines = (cart: Record<number, number>) =>
  Object.entries(cart)
    .map(([id, qty]) => ({ product: store.products.find((p) => p.id === Number(id))!, qty }))
    .filter((l) => l.product);

export const cartCount = (cart: Record<number, number>) => Object.values(cart).reduce((a, b) => a + b, 0);

/** Builds the wa.me link with the order lines and total. */
export function whatsappUrl(cart: Record<number, number>) {
  const lines = cartLines(cart);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const c = store.cart;
  const body = [
    c.orderGreeting,
    "",
    ...lines.map((l, i) => `${i + 1}. ${l.product.name} × ${l.qty} = ${(l.product.price * l.qty).toLocaleString("en-US")} ${store.currency}`),
    "",
    `${c.total}: ${total.toLocaleString("en-US")} ${store.currency}`,
  ].join("\n");
  return `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(body)}`;
}

export const searchProducts = (q: string) => {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return store.products.filter((p) => p.name.toLowerCase().includes(t));
};
