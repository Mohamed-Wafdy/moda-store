import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { deals, discountPercent, newArrivals, productById, store } from "@/lib/store";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a product page for every product id", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    for (const p of store.products) {
      const matches = router.matchRoutes(`/product/${p.id}`);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    }
  });
});

describe("Home page sections", () => {
  it("lists only discounted products in the deals section", () => {
    expect(deals.length).toBeGreaterThan(0);
    for (const p of deals) {
      expect(p.oldPrice).not.toBeNull();
      expect(discountPercent(p)).toBeGreaterThan(0);
    }
    // every discounted product is listed, and nothing else is
    expect(deals.length).toBe(store.products.filter((p) => p.oldPrice !== null).length);
  });

  it("lists only new arrivals in the new arrivals section", () => {
    expect(newArrivals.length).toBeGreaterThan(0);
    expect(newArrivals.every((p) => p.newArrival)).toBe(true);
  });

  it("carries no filter chips on the home page", () => {
    expect("filters" in store).toBe(false);
  });
});

describe("Product page", () => {
  it("finds a product by id and has copy to show", () => {
    const p = productById(3);
    expect(p?.name).toBe("حذاء رياضي أبيض");
    expect(p?.description.length).toBeGreaterThan(10);
  });
});
