import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, img, store } from "@/lib/store";
import { cartLines, shop, useShop, whatsappUrl } from "@/lib/shop-state";

export function CartPanel() {
  const { cart, cartOpen } = useShop();
  const lines = cartLines(cart);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const c = store.cart;
  return (
    <Sheet open={cartOpen} onOpenChange={shop.openCart}>
      <SheetContent side="left" dir="rtl" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-right">{c.title}</SheetTitle>
        </SheetHeader>
        {lines.length === 0 ? (
          <p className="flex-1 py-16 text-center text-muted-foreground">{c.empty}</p>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id} className="flex gap-3">
                  <img src={img(p.image)} alt={p.name} width={80} height={80} className="h-20 w-20 rounded-lg bg-muted object-cover" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm">{p.name}</span>
                    <span className="font-semibold">{formatPrice(p.price * qty)}</span>
                    <div className="mt-auto flex items-center gap-2" aria-label={c.qtyLabel}>
                      <button aria-label="+" onClick={() => shop.setQty(p.id, qty + 1)} className="rounded-full border border-border p-1"><Plus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button aria-label="-" onClick={() => shop.setQty(p.id, qty - 1)} className="rounded-full border border-border p-1"><Minus className="h-3 w-3" /></button>
                      <button aria-label={c.remove} onClick={() => shop.setQty(p.id, 0)} className="ms-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between font-semibold">
                <span>{c.total}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <a
                href={whatsappUrl(cart)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-full bg-primary py-3 text-primary-foreground"
              >
                {c.checkout}
              </a>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function FavPanel() {
  const { favs, favOpen } = useShop();
  const items = store.products.filter((p) => favs.includes(p.id));
  const f = store.favorites;
  return (
    <Sheet open={favOpen} onOpenChange={shop.openFav}>
      <SheetContent side="left" dir="rtl" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-right">{f.title}</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{f.empty}</p>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto">
            {items.map((p) => (
              <li key={p.id} className="flex gap-3">
                <img src={img(p.image)} alt={p.name} width={80} height={80} className="h-20 w-20 rounded-lg bg-muted object-cover" />
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm">{p.name}</span>
                  <span className="font-semibold">{formatPrice(p.price)}</span>
                  <div className="mt-auto flex items-center gap-3">
                    <button onClick={() => shop.add(p.id)} className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                      <ShoppingCart className="h-3 w-3" />
                      {store.cart.addToCart}
                    </button>
                    <button onClick={() => shop.toggleFav(p.id)} className="text-xs text-muted-foreground hover:text-destructive">{f.remove}</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
