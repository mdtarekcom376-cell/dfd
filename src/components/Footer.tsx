import { Link } from "@tanstack/react-router";
import { Facebook, MapPin } from "lucide-react";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { FACEBOOK_URL } from "@/lib/brand";
import { DEFAULT_CATEGORIES } from "@/lib/sanityClient";

export function Footer() {
  const { lang, t } = useI18n();
  const bn = lang === "bn" ? "font-bangla" : "";
  const shopCategories = DEFAULT_CATEGORIES.filter((c) => c.slug !== "all");

  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo size={40} />
            <span className={`font-display text-lg font-semibold ${bn}`}>{t("brand")}</span>
          </div>
          <p className={`mt-3 max-w-sm text-sm text-muted-foreground ${bn}`}>{t("tagline")}</p>
        </div>

        <div>
          <h4 className={`text-sm font-semibold ${bn}`}>{t("shop")}</h4>
          <ul className={`mt-3 space-y-2 text-sm text-muted-foreground ${bn}`}>
            {shopCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/shop"
                  search={{ category: c.slug }}
                  className="hover:text-foreground"
                >
                  {pickLocalized(c.title, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`text-sm font-semibold ${bn}`}>{t("contact")}</h4>
          <ul className={`mt-3 space-y-2 text-sm text-muted-foreground ${bn}`}>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t("locationValue")}</span>
            </li>
            <li>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Facebook className="h-4 w-4" />
                {t("facebook")}
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">{t("contactUs")}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className={`container-x py-5 text-center text-xs text-muted-foreground ${bn}`}>
          {t("footer")}
        </p>
      </div>
    </footer>
  );
}
