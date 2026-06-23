/**
 * Sanity CMS data layer.
 *
 * Expected Sanity schemas:
 *
 * // category.ts
 * defineType({
 *   name: "category", type: "document",
 *   fields: [
 *     defineField({ name: "slug",   type: "slug",   options: { source: "titleEn" } }),
 *     defineField({ name: "titleBn", type: "string", title: "Title (Bangla)" }),
 *     defineField({ name: "titleEn", type: "string", title: "Title (English)" }),
 *     defineField({ name: "order",   type: "number" }),
 *   ],
 * });
 *
 * // product.ts
 * defineType({
 *   name: "product", type: "document",
 *   fields: [
 *     defineField({ name: "slug",         type: "slug", options: { source: "titleEn" } }),
 *     defineField({ name: "titleBn",      type: "string",  title: "Title (Bangla)" }),
 *     defineField({ name: "titleEn",      type: "string",  title: "Title (English)" }),
 *     defineField({ name: "descriptionBn",type: "text",    title: "Description (Bangla)" }),
 *     defineField({ name: "descriptionEn",type: "text",    title: "Description (English)" }),
 *     defineField({ name: "price",        type: "number" }),
 *     defineField({ name: "discountPrice",type: "number",  title: "Discount Price (optional)" }),
 *     defineField({ name: "currency",     type: "string",  initialValue: "BDT" }),
 *     defineField({ name: "category",     type: "reference", to: [{ type: "category" }] }),
 *     defineField({ name: "images",       type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
 *     defineField({ name: "sizes",        type: "array", of: [{ type: "string" }] }),
 *     defineField({ name: "specifications", type: "array", of: [{ type: "object", fields: [
 *        defineField({ name: "label", type: "string" }),
 *        defineField({ name: "value", type: "string" }),
 *     ]}]}),
 *     defineField({ name: "inStock",      type: "boolean", initialValue: true }),
 *     defineField({ name: "featured",     type: "boolean", initialValue: false }),
 *   ],
 * });
 */

import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export interface SanityImage {
  asset?: { _ref?: string; _type?: string; url?: string };
  _type?: string;
}

export interface LocalizedString {
  bn: string;
  en: string;
}

export interface Specification {
  label: LocalizedString;
  value: LocalizedString;
}

export type CategorySlug = "sari" | "bed-cloth" | "pajama" | "orna" | "other";

export interface Product {
  _id: string;
  _type: "product";
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  price: number;
  discountPrice?: number;
  currency: string;
  category: CategorySlug;
  images: SanityImage[];
  /** Convenience alias for the cover image. */
  image: SanityImage;
  sizes?: string[];
  specifications?: Specification[];
  inStock: boolean;
  featured?: boolean;
}

export interface Category {
  _id: string;
  _type: "category";
  slug: "all" | CategorySlug;
  title: LocalizedString;
  order: number;
}

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "1qlynw8a";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const imageBuilder = imageUrlBuilder(sanityClient);

/** Canonical shop categories — merged with Sanity data when available. */
export const DEFAULT_CATEGORIES: Category[] = [
  { _id: "local-all", _type: "category", slug: "all", title: { bn: "সব", en: "All" }, order: 0 },
  { _id: "local-sari", _type: "category", slug: "sari", title: { bn: "শাড়ি", en: "Sari" }, order: 1 },
  {
    _id: "local-bed",
    _type: "category",
    slug: "bed-cloth",
    title: { bn: "বেডশিট/বেড ক্লথ", en: "Bed Cloth" },
    order: 2,
  },
  { _id: "local-pajama", _type: "category", slug: "pajama", title: { bn: "পায়জামা", en: "Pajama" }, order: 3 },
  { _id: "local-orna", _type: "category", slug: "orna", title: { bn: "ওড়না", en: "Orna" }, order: 4 },
  { _id: "local-other", _type: "category", slug: "other", title: { bn: "অন্যান্য", en: "Other Items" }, order: 5 },
];

export const queries = {
  allProducts: `*[_type == "product"] | order(_createdAt desc){
    _id, "slug": slug.current, "title": {"bn": titleBn, "en": titleEn},
    "description": {"bn": descriptionBn, "en": descriptionEn},
    price, discountPrice, currency, "category": category->slug.current,
    images, "image": images[0], sizes, specifications, inStock, featured
  }`,
  allCategories: `*[_type == "category"] | order(order asc){
    _id, "slug": slug.current, "title": {"bn": titleBn, "en": titleEn}, order
  }`,
  productBySlug: `*[_type == "product" && slug.current == $slug][0]{
    _id, "slug": slug.current, "title": {"bn": titleBn, "en": titleEn},
    "description": {"bn": descriptionBn, "en": descriptionEn},
    price, discountPrice, currency, "category": category->slug.current,
    images, "image": images[0], sizes, specifications, inStock, featured
  }`,
};

function toLocalized(value: unknown): LocalizedString {
  if (value && typeof value === "object" && "bn" in value && "en" in value) {
    const v = value as { bn?: string; en?: string };
    return { bn: v.bn ?? v.en ?? "", en: v.en ?? v.bn ?? "" };
  }
  const s = typeof value === "string" ? value : "";
  return { bn: s, en: s };
}

function normalizeSpecifications(
  specs: unknown[] | undefined,
): Specification[] | undefined {
  if (!specs?.length) return undefined;
  return specs.map((s) => {
    const row = s as Record<string, unknown>;
    return {
      label: toLocalized(row.label),
      value: toLocalized(row.value),
    };
  });
}

function normalizeProduct(raw: Product): Product {
  return {
    ...raw,
    currency: raw.currency ?? "BDT",
    inStock: raw.inStock ?? true,
    images: raw.images ?? (raw.image ? [raw.image] : []),
    image: raw.image ?? raw.images?.[0],
    specifications: normalizeSpecifications(raw.specifications as unknown[] | undefined),
  };
}

/** Merge Sanity categories with local defaults so navigation always shows all shop filters. */
export function mergeCategories(remote: Category[]): Category[] {
  const bySlug = new Map(remote.filter((c) => c.slug !== "all").map((c) => [c.slug, c]));
  const merged = DEFAULT_CATEGORIES.map((def) => {
    const fromSanity = bySlug.get(def.slug);
    if (!fromSanity) return def;
    return {
      ...def,
      _id: fromSanity._id,
      title: fromSanity.title?.bn || fromSanity.title?.en ? fromSanity.title : def.title,
      order: fromSanity.order ?? def.order,
    };
  });
  return merged.sort((a, b) => a.order - b.order);
}

export async function fetchProducts(): Promise<Product[]> {
  const rows = await sanityClient.fetch<Product[]>(queries.allProducts);
  return (rows ?? []).map(normalizeProduct);
}

export async function fetchCategories(): Promise<Category[]> {
  const rows = await sanityClient.fetch<Category[]>(queries.allCategories);
  return mergeCategories(rows ?? []);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const row = await sanityClient.fetch<Product | null>(queries.productBySlug, { slug });
  return row ? normalizeProduct(row) : null;
}

export function getCategoryTitle(slug: string): LocalizedString | undefined {
  return DEFAULT_CATEGORIES.find((c) => c.slug === slug)?.title;
}

export function urlFor(image: SanityImage | undefined): string {
  if (!image) return "";
  if (image.asset?.url) return image.asset.url;
  try {
    return imageBuilder.image(image).width(1200).auto("format").url();
  } catch {
    return "";
  }
}
