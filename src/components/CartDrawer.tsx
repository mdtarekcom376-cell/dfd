import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { buildCartMessage, whatsappUrl, effectivePrice } from "@/lib/whatsapp";
import { urlFor } from "@/lib/sanityClient";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, total, clear } = useCart();
  const { lang, t } = useI18n();
  const message = buildCartMessage(items, lang);
  const bn = lang === "bn" ? "font-bangla" : "";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className={`font-display text-xl ${bn}`}>
            {t("cart")} {items.length > 0 && <span className="text-muted-foreground">({items.length})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className={`mt-12 text-center text-sm text-muted-foreground ${bn}`}>{t("cartEmpty")}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((it) => {
                const name = pickLocalized(it.product.title, lang);
                const unit = effectivePrice(it.product);
                return (
                  <li key={it.product._id} className="flex gap-3">
                    <img
                      src={urlFor(it.product.image)}
                      alt={name}
                      className="h-20 w-16 shrink-0 rounded-md object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start gap-2">
                        <h4 className={`min-w-0 flex-1 truncate text-sm font-medium ${bn}`}>{name}</h4>
                        <button
                          onClick={() => remove(it.product._id)}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label={t("remove")}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-primary">৳{unit * it.qty}</p>
                      <div className="mt-2 inline-flex items-center gap-1 self-start rounded-full border">
                        <button onClick={() => setQty(it.product._id, it.qty - 1)} className="p-1.5 hover:bg-muted rounded-l-full" aria-label="decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm">{it.qty}</span>
                        <button onClick={() => setQty(it.product._id, it.qty + 1)} className="p-1.5 hover:bg-muted rounded-r-full" aria-label="increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-background px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className={`text-sm text-muted-foreground ${bn}`}>{t("total")}</span>
              <span className="font-display text-2xl text-primary">৳{total} <span className="text-sm text-muted-foreground">BDT</span></span>
            </div>
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(() => { clear(); setOpen(false); }, 400)}
              className={`flex w-full items-center justify-center gap-2 rounded-md bg-[var(--whatsapp)] px-4 py-3 text-sm font-medium text-[var(--whatsapp-foreground)] transition-opacity hover:opacity-90 ${bn}`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t("checkoutWhatsapp")}
            </a>
            <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={clear}>
              Clear
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
