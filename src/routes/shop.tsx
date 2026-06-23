import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, fetchCategories, type Product, type Category } from "@/lib/sanityClient";
import { effectivePrice } from "@/lib/whatsapp";

const sortValues = ["newest", "price-asc", "price-desc"] as const;

const shopSearchSchema = z.object({
  category: fallback(z.string(), "all").default("all"),
  sort: fallback(z.enum(sortValues), "newest").default("newest"),
  max: fallback(z.number().int().min(0), 0).default(0),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  head: () => ({
    meta: [
      { title: "সব পণ্য — দুমকি ওড়না ঘর" },
      { name: "description", content: "শাড়ি, ওড়না, পায়জামা ও বেডশিটের সম্পূর্ণ সংগ্রহ। ক্যাটাগরি ও দাম অনুযায়ী ফিল্টার করুন।" },
      { property: "og:title", content: "Shop — Dumki Orana Ghara" },
      { property: "og:description", content: "Browse all saris, ornas, pajamas and bedsheets. Filter by category and price." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { lang, t } = useI18n();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const bn = lang === "bn" ? "font-bangla" : "";

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const maxPrice = useMemo(
    () => products.reduce((m, p) => Math.max(m, p.price), 0),
    [products],
  );
  const [localMax, setLocalMax] = useState<number | null>(null);
  const activeMax = localMax ?? (search.max > 0 ? search.max : maxPrice);

  const filtered = useMemo(() => {
    let list = products;
    if (search.category !== "all") list = list.filter((p) => p.category === search.category);
    if (activeMax && activeMax > 0) list = list.filter((p) => effectivePrice(p) <= activeMax);
    if (search.sort === "price-asc") list = [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (search.sort === "price-desc") list = [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a));
    return list;
  }, [products, search.category, search.sort, activeMax]);

  const setCategory = (c: string) =>
    navigate({ search: (prev: z.infer<typeof shopSearchSchema>) => ({ ...prev, category: c }) });
  const setSort = (s: (typeof sortValues)[number]) =>
    navigate({ search: (prev: z.infer<typeof shopSearchSchema>) => ({ ...prev, sort: s }) });

  return (
    <div className="container-x py-8 md:py-12">
      <div className="mb-6">
        <p className={`text-xs uppercase tracking-[0.25em] text-muted-foreground ${bn}`}>
          {t("shop")}
        </p>
        <h1 className={`mt-2 font-display text-3xl md:text-4xl ${bn}`}>{t("allProducts")}</h1>
      </div>

      {/* Category chips */}
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {categories.map((c) => {
          const active = search.category === c.slug;
          return (
            <button
              key={c._id}
              onClick={() => setCategory(c.slug)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/40 text-foreground/70 hover:text-foreground"
              } ${bn}`}
            >
              {pickLocalized(c.title, lang)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className="space-y-6 md:sticky md:top-20 md:self-start">
          <div>
            <h3 className={`mb-2 text-xs uppercase tracking-wider text-muted-foreground ${bn}`}>
              {t("sortBy")}
            </h3>
            <div className="flex flex-col gap-1.5">
              {([
                ["newest", t("newest")],
                ["price-asc", t("priceLowHigh")],
                ["price-desc", t("priceHighLow")],
              ] as const).map(([val, label]) => (
                <label key={val} className={`flex cursor-pointer items-center gap-2 text-sm ${bn}`}>
                  <input
                    type="radio"
                    name="sort"
                    checked={search.sort === val}
                    onChange={() => setSort(val)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {maxPrice > 0 && (
            <div>
              <h3 className={`mb-2 text-xs uppercase tracking-wider text-muted-foreground ${bn}`}>
                {t("priceRange")}
              </h3>
              <input
                type="range"
                min={100}
                max={maxPrice}
                step={50}
                value={activeMax}
                onChange={(e) => setLocalMax(Number(e.target.value))}
                onMouseUp={(e) =>
                  navigate({ search: (prev: z.infer<typeof shopSearchSchema>) => ({ ...prev, max: Number((e.target as HTMLInputElement).value) }) })
                }
                onTouchEnd={(e) =>
                  navigate({ search: (prev: z.infer<typeof shopSearchSchema>) => ({ ...prev, max: Number((e.target as HTMLInputElement).value) }) })
                }
                className="w-full accent-primary"
              />
              <p className={`mt-1 text-xs text-muted-foreground ${bn}`}>
                ৳0 — ৳{activeMax} BDT
              </p>
            </div>
          )}
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <p className={`py-20 text-center text-muted-foreground ${bn}`}>{t("noProducts")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="sr-only">
        <Link to="/contact">Contact</Link>
      </p>
    </div>
  );
}
