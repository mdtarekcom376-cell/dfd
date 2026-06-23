import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, fetchCategories, urlFor, type Product, type Category } from "@/lib/sanityClient";
import heroImg from "@/assets/hero.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "দুমকি ওড়না ঘর — শাড়ি, ওড়না, পায়জামা ও বেডশিট" },
      { name: "description", content: "বাংলাদেশের কারিগর তৈরি শাড়ি, ওড়না, পায়জামা ও বেডশিট। হোয়াটসঅ্যাপে সহজ অর্ডার।" },
      { property: "og:title", content: "দুমকি ওড়না ঘর — Dumki Orana Ghara" },
      { property: "og:description", content: "Artisan-crafted saris, ornas, pajamas and bedsheets. Order easily via WhatsApp." },
    ],
  }),
  component: Home,
});

function Home() {
  const { lang, t } = useI18n();
  const bn = lang === "bn" ? "font-bangla" : "";

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const shopCats = categories.filter((c) => c.slug !== "all");

  return (
    <div id="top">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="animate-fade-up order-2 md:order-1">
            <p className={`text-xs uppercase tracking-[0.25em] text-muted-foreground ${bn}`}>
              {t("newArrivals")}
            </p>
            <h1 className={`mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl ${bn}`}>
              {lang === "bn" ? (
                <>প্রতিটি পোশাকে<br /><span className="italic text-primary">ভালোবাসার ছোঁয়া।</span></>
              ) : (
                <>Every piece,<br /><span className="italic text-primary">a touch of love.</span></>
              )}
            </h1>
            <p className={`mt-5 max-w-md text-base text-muted-foreground ${bn}`}>{t("tagline")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] ${bn}`}
              >
                {t("shopNow")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary ${bn}`}
              >
                {t("contactUs")}
              </Link>
            </div>
          </div>
          <div className="animate-fade-up order-1 md:order-2 relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/40 via-primary/10 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-muted shadow-[0_30px_80px_-40px_oklch(0.45_0.13_25/0.45)]">
              <img
                src={heroImg}
                alt="Dumki Orana Ghara"
                width={1280}
                height={1600}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className={`font-display text-2xl md:text-3xl ${bn}`}>
            {lang === "bn" ? "ক্যাটাগরি" : "Shop by Category"}
          </h2>
          <Link to="/shop" className={`text-sm text-primary hover:underline ${bn}`}>
            {t("allProducts")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {shopCats.map((c) => {
            const sample = products.find((p) => p.category === c.slug);
            return (
              <Link
                key={c._id}
                to="/shop"
                search={{ category: c.slug }}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
              >
                {sample && (
                  <img
                    src={urlFor(sample.image)}
                    alt={pickLocalized(c.title, lang)}
                    className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-95"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <span className={`absolute bottom-3 left-3 right-3 text-sm font-medium text-background ${bn}`}>
                  {pickLocalized(c.title, lang)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured collection */}
      {featured.length > 0 && (
        <section className="container-x py-12 md:py-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-xs uppercase tracking-[0.25em] text-muted-foreground ${bn}`}>
                {t("featured")}
              </p>
              <h2 className={`mt-2 font-display text-3xl md:text-4xl ${bn}`}>
                {lang === "bn" ? "নির্বাচিত সংগ্রহ" : "Featured Collection"}
              </h2>
            </div>
            <Link to="/shop" className={`text-sm text-primary hover:underline ${bn}`}>
              {t("allProducts")} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* About */}
      <section id="about" className="border-y border-border/60 bg-secondary/30">
        <div className="container-x grid gap-8 py-16 md:grid-cols-2 md:py-24">
          <h2 className={`font-display text-3xl md:text-5xl ${bn}`}>{t("about")}</h2>
          <p className={`text-base leading-relaxed text-foreground/80 ${bn}`}>{t("aboutBody")}</p>
        </div>
      </section>
    </div>
  );
}
