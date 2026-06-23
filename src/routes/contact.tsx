import { createFileRoute } from "@tanstack/react-router";
import { Facebook, MapPin, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { FACEBOOK_URL } from "@/lib/brand";
import { whatsappUrl, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "যোগাযোগ — দুমকি ওড়না ঘর" },
      { name: "description", content: "অর্ডার, কাস্টম ডিজাইন বা যেকোনো জিজ্ঞাসায় আমাদের সাথে যোগাযোগ করুন।" },
      { property: "og:title", content: "Contact — Dumki Orana Ghara" },
      { property: "og:description", content: "Reach out for orders, custom designs or any questions." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang, t } = useI18n();
  const bn = lang === "bn" ? "font-bangla" : "";

  const cards = [
    {
      icon: <Facebook className="h-5 w-5" />,
      title: t("facebook"),
      desc: "facebook.com/dumaki.orana.ghara",
      href: FACEBOOK_URL,
      cta: lang === "bn" ? "পেজ দেখুন" : "Visit page",
    },
    {
      icon: <WhatsAppIcon className="h-5 w-5" />,
      title: "WhatsApp",
      desc: `+${WHATSAPP_PHONE}`,
      href: whatsappUrl("Hello দুমকি ওড়না ঘর! 👋"),
      cta: t("messageUs"),
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t("location"),
      desc: t("locationValue"),
      href: "https://maps.google.com/?q=Dumki+Patuakhali+Bangladesh",
      cta: lang === "bn" ? "ম্যাপে দেখুন" : "Open in maps",
    },
  ];

  return (
    <div className="container-x py-10 md:py-16">
      <div className="max-w-2xl">
        <p className={`text-xs uppercase tracking-[0.25em] text-muted-foreground ${bn}`}>
          {t("contact")}
        </p>
        <h1 className={`mt-3 font-display text-4xl md:text-5xl ${bn}`}>{t("contactUs")}</h1>
        <p className={`mt-4 text-base leading-relaxed text-muted-foreground ${bn}`}>{t("contactBody")}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_oklch(0.45_0.13_25/0.35)]"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              {c.icon}
            </div>
            <h3 className={`font-display text-lg ${bn}`}>{c.title}</h3>
            <p className="text-sm text-muted-foreground break-words">{c.desc}</p>
            <span className={`mt-auto inline-flex items-center gap-1 text-sm text-primary group-hover:underline ${bn}`}>
              {c.cta} →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6 md:p-10">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className={`mt-3 font-display text-2xl md:text-3xl ${bn}`}>
          {lang === "bn" ? "দ্রুত অর্ডার করতে চান?" : "Need to place a quick order?"}
        </h2>
        <p className={`mt-2 max-w-xl text-sm text-muted-foreground ${bn}`}>
          {lang === "bn"
            ? "আমাদের শপ পেজ থেকে পণ্য নির্বাচন করে সরাসরি হোয়াটসঅ্যাপে অর্ডার পাঠান।"
            : "Pick a product from our shop page and send the order directly on WhatsApp."}
        </p>
        <a
          href={whatsappUrl("Hello দুমকি ওড়না ঘর! 👋\nI would like to place an order.")}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--whatsapp)] px-6 py-3 text-sm font-medium text-[var(--whatsapp-foreground)] transition-opacity hover:opacity-90 ${bn}`}
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t("orderWhatsapp")}
        </a>
      </div>
    </div>
  );
}
