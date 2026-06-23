import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { fetchProductBySlug, urlFor, type Product } from "@/lib/sanityClient";
import { ProductDetail } from "@/components/ProductDetail";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product — দুমকি ওড়না ঘর" }] };
    const imageUrl = urlFor(p.image);
    return {
      meta: [
        { title: `${p.title.bn} — দুমকি ওড়না ঘর` },
        { name: "description", content: p.description.en },
        { property: "og:title", content: `${p.title.en} — Dumki Orana Ghara` },
        { property: "og:description", content: p.description.en },
        ...(imageUrl ? [{ property: "og:image", content: imageUrl }, { name: "twitter:image", content: imageUrl }] : []),
      ],
    };
  },
  notFoundComponent: NotFoundProduct,
  errorComponent: ({ error, reset }) => (
    <div className="container-x py-20 text-center">
      <p className="text-destructive">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground">Try again</button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData().product;
  const { lang } = useI18n();

  const { data: product = initial } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const p = await fetchProductBySlug(slug);
      if (!p) throw notFound();
      return p;
    },
    initialData: initial,
  });

  return (
    <div>
      <div className="container-x pt-6">
        <Link to="/shop" className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
          <ArrowLeft className="h-4 w-4" /> {lang === "bn" ? "শপে ফিরে যান" : "Back to shop"}
        </Link>
      </div>
      <ProductDetail product={product} />
    </div>
  );
}

function NotFoundProduct() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">Back to shop</Link>
    </div>
  );
}
