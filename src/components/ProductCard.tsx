import { Link } from "@tanstack/react-router";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { buildProductMessage, whatsappUrl, effectivePrice, productPageUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/sanityClient";
import { urlFor, getCategoryTitle } from "@/lib/sanityClient";

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const { add } = useCart();
  const name = pickLocalized(product.title, lang);
  const categoryTitle = getCategoryTitle(product.category);
  const msg = buildProductMessage(product, lang, productPageUrl(product.slug));
  const finalPrice = effectivePrice(product);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const off = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:shadow-[0_24px_60px_-30px_oklch(0.45_0.13_25/0.35)] hover:-translate-y-1">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-[4/5] overflow-hidden bg-muted"
        aria-label={name}
      >
        <img
          src={urlFor(product.image)}
          alt={name}
          width={800}
          height={1000}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground/70 backdrop-blur ${lang === "bn" ? "font-bangla normal-case" : ""}`}>
          {categoryTitle ? pickLocalized(categoryTitle, lang) : product.category}
        </span>
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
            -{off}% {t("off")}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1.5 text-center text-[11px] font-medium text-background">
            {t("outOfStock")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className={`truncate text-base font-medium ${lang === "bn" ? "font-bangla" : ""}`}>{name}</h3>
          <p className="mt-1 flex items-baseline gap-2 text-sm text-muted-foreground">
            <span className="font-display text-lg text-foreground">৳{finalPrice}</span>
            {hasDiscount && (
              <span className="text-xs line-through opacity-60">৳{product.price}</span>
            )}
            <span className="text-xs">BDT</span>
          </p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => add(product)}
            disabled={!product.inStock}
            className={lang === "bn" ? "font-bangla" : ""}
          >
            {t("addToCart")}
          </Button>
          <a
            href={whatsappUrl(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--whatsapp)] px-3 py-1.5 text-xs font-medium text-[var(--whatsapp-foreground)] transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            <span className={lang === "bn" ? "font-bangla" : ""}>
              {lang === "bn" ? "অর্ডার" : "Order"}
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
