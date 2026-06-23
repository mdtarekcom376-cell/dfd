import { useState } from "react";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { buildProductMessage, whatsappUrl, effectivePrice, productPageUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/sanityClient";
import { urlFor, getCategoryTitle } from "@/lib/sanityClient";

/**
 * Full product detail view. Used by /product/$slug page.
 * Shows gallery, pricing, sizes, specifications.
 */
export function ProductDetail({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const { add } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);

  const name = pickLocalized(product.title, lang);
  const desc = pickLocalized(product.description, lang);
  const categoryTitle = getCategoryTitle(product.category);
  const bn = lang === "bn" ? "font-bangla" : "";

  const finalPrice = effectivePrice(product);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const msg = buildProductMessage(product, lang, productPageUrl(product.slug));

  return (
    <div className="container-x grid gap-10 py-8 md:grid-cols-2 md:py-14">
      {/* Gallery */}
      <div className="animate-fade-up">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <img
            src={urlFor(product.images[activeImg] ?? product.image)}
            alt={name}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {product.images.map((im, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`overflow-hidden rounded-md border bg-muted transition-all ${
                  i === activeImg ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100"
                }`}
                aria-label={`Image ${i + 1}`}
              >
                <img src={urlFor(im)} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="animate-fade-up flex flex-col gap-5">
        <div>
          <p className={`text-xs uppercase tracking-[0.2em] text-muted-foreground ${bn}`}>
            {categoryTitle ? pickLocalized(categoryTitle, lang) : product.category}
          </p>
          <h1 className={`mt-2 font-display text-3xl md:text-4xl ${bn}`}>{name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-4xl text-primary">৳{finalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">৳{product.price}</span>
                <span className={`rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary ${bn}`}>
                  -{Math.round((1 - product.discountPrice! / product.price) * 100)}% {t("off")}
                </span>
              </>
            )}
            <span className="text-sm text-muted-foreground">BDT</span>
          </div>
          <p className={`mt-3 text-xs ${product.inStock ? "text-[var(--whatsapp)]" : "text-destructive"} ${bn}`}>
            ● {product.inStock ? t("inStock") : t("outOfStock")}
          </p>
        </div>

        <div>
          <h3 className={`text-xs uppercase tracking-wider text-muted-foreground ${bn}`}>
            {t("description")}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed text-foreground/80 ${bn}`}>{desc}</p>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h3 className={`text-xs uppercase tracking-wider text-muted-foreground ${bn}`}>
              {t("sizeGuide")}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    size === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary/40 hover:border-foreground/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.specifications && product.specifications.length > 0 && (
          <div>
            <h3 className={`text-xs uppercase tracking-wider text-muted-foreground ${bn}`}>
              {t("specifications")}
            </h3>
            <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
              {product.specifications.map((s, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 px-4 py-2 text-sm">
                  <dt className={`text-muted-foreground ${bn}`}>{pickLocalized(s.label, lang)}</dt>
                  <dd className={bn}>{pickLocalized(s.value, lang)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className={`flex-1 ${bn}`}
            disabled={!product.inStock}
            onClick={() => add(product)}
          >
            {t("addToCart")}
          </Button>
          <a
            href={whatsappUrl(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[var(--whatsapp)] px-4 py-2.5 text-sm font-medium text-[var(--whatsapp-foreground)] transition-opacity hover:opacity-90 ${bn}`}
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t("orderWhatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}
