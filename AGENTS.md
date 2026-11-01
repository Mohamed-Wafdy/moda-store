
## Structure

- Shared header/bottom nav live in `src/components/store/StoreShell.tsx` and helpers (images, category lookup, filtering) in `src/lib/store.ts`; every page wraps in StoreShell so the top bar stays identical.
- Products carry a `categories` array; a category page at `/category/$categoryId` lists any product tagged with that id (`all` shows everything).
- `ProductCard` links to `/product/$productId`; add-to-cart and the quantity picker live only on that product page, so the card stays a link and the heart button sits above it as a sibling, never nested inside the anchor.
