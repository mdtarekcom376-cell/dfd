import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const NAV: { to: "/" | "/shop" | "/contact"; key: "home" | "shop" | "contact" }[] = [
  { to: "/", key: "home" },
  { to: "/shop", key: "shop" },
  { to: "/contact", key: "contact" },
];

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const bn = lang === "bn" ? "font-bangla" : "";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <Logo size={38} />
          <span className={`truncate font-display text-base sm:text-lg font-semibold ${bn}`}>
            {t("brand")}
          </span>
        </Link>

        <nav className={`ml-auto hidden md:flex items-center gap-7 text-sm ${bn}`}>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: true }}
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto md:ml-0 flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-0.5 text-xs font-medium">
          <button
            onClick={() => setLang("bn")}
            className={`rounded-full px-2.5 py-1 transition-colors ${lang === "bn" ? "bg-foreground text-background" : "text-muted-foreground"}`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLang("en")}
            className={`rounded-full px-2.5 py-1 transition-colors ${lang === "en" ? "bg-foreground text-background" : "text-muted-foreground"}`}
          >
            EN
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0"
          onClick={() => setOpen(true)}
          aria-label={t("cart")}
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t("menu")}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background animate-fade-up">
          <nav className={`container-x flex flex-col py-3 ${bn}`}>
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-3 text-base text-foreground/80 hover:bg-secondary/60"
                activeProps={{ className: "text-primary font-medium" }}
                activeOptions={{ exact: true }}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
