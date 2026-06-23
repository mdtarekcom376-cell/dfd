import type { CartItem } from "./cart";
import type { Product } from "./sanityClient";
import { pickLocalized, type Lang } from "./i18n";

/** International format without + prefix (Bangladesh). */
export const WHATSAPP_PHONE = "8801875148566";

export function effectivePrice(p: Product): number {
  return p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
}

export function productPageUrl(slug: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/product/${slug}`;
}

export function buildProductMessage(p: Product, lang: Lang, pageUrl?: string): string {
  const name = pickLocalized(p.title, lang);
  const desc = pickLocalized(p.description, lang);
  const details = pageUrl ?? desc;
  return [
    "Hello দুমকি ওড়না ঘর! 👋",
    "I want to order this item.",
    "",
    `Product: ${name}`,
    `Price: ${effectivePrice(p)} BDT`,
    `Details: ${details}`,
  ].join("\n");
}

export function buildCartMessage(items: CartItem[], lang: Lang): string {
  const lines = [
    "Hello দুমকি ওড়না ঘর! 👋",
    "I want to order the following items.",
    "",
  ];
  let total = 0;
  items.forEach((it, idx) => {
    const name = pickLocalized(it.product.title, lang);
    const unit = effectivePrice(it.product);
    const sub = unit * it.qty;
    total += sub;
    lines.push(`${idx + 1}. ${name}`);
    lines.push(`   Qty: ${it.qty}  •  Price: ${unit} BDT  •  Subtotal: ${sub} BDT`);
  });
  lines.push("", `Total: ${total} BDT`);
  return lines.join("\n");
}

export function whatsappUrl(message: string, phone: string = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
