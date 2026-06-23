import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

type Dict = Record<string, { bn: string; en: string }>;

const DICT: Dict = {
  brand: { bn: "দুমকি ওড়না ঘর", en: "Dumki Orana Ghara" },
  tagline: {
    bn: "ঐতিহ্য আর আধুনিকতার মেলবন্ধনে নির্বাচিত পোশাকের সংগ্রহ।",
    en: "A curated clothing collection where tradition meets modern grace.",
  },
  shopNow: { bn: "এখনই কিনুন", en: "Shop Now" },
  newArrivals: { bn: "নতুন সংগ্রহ", en: "New Arrivals" },
  collection: { bn: "সংগ্রহ", en: "Collection" },
  shop: { bn: "শপ", en: "Shop" },
  home: { bn: "হোম", en: "Home" },
  allProducts: { bn: "সব পণ্য", en: "All Products" },
  featured: { bn: "ফিচার্ড", en: "Featured" },
  orderWhatsapp: { bn: "হোয়াটসঅ্যাপে অর্ডার", en: "Order via WhatsApp" },
  addToCart: { bn: "কার্টে যোগ করুন", en: "Add to Cart" },
  viewDetails: { bn: "বিস্তারিত দেখুন", en: "View Details" },
  cart: { bn: "কার্ট", en: "Cart" },
  cartEmpty: { bn: "আপনার কার্ট খালি।", en: "Your cart is empty." },
  total: { bn: "মোট", en: "Total" },
  checkoutWhatsapp: { bn: "হোয়াটসঅ্যাপে চেকআউট", en: "Checkout via WhatsApp" },
  remove: { bn: "মুছুন", en: "Remove" },
  filter: { bn: "ফিল্টার", en: "Filter" },
  category: { bn: "ক্যাটাগরি", en: "Category" },
  price: { bn: "মূল্য", en: "Price" },
  priceRange: { bn: "দামের পরিসীমা", en: "Price Range" },
  sortBy: { bn: "সাজান", en: "Sort by" },
  newest: { bn: "নতুন", en: "Newest" },
  priceLowHigh: { bn: "দাম: কম থেকে বেশি", en: "Price: Low to High" },
  priceHighLow: { bn: "দাম: বেশি থেকে কম", en: "Price: High to Low" },
  about: { bn: "আমাদের সম্পর্কে", en: "About Us" },
  aboutBody: {
    bn: "দুমকি ওড়না ঘর — বাংলাদেশের নারীদের জন্য হস্তশিল্পী কারিগরদের তৈরি শাড়ি, ওড়না, পায়জামা ও বেডশিটের এক অভিজাত ঠিকানা। প্রতিটি পণ্য যত্নে বাছাই করা, যাতে আপনি পরেন গর্বের সাথে।",
    en: "Dumki Orana Ghara curates artisan-made saris, ornas, pajamas and bedsheets for women of Bangladesh. Each piece is selected with care so you wear it with pride.",
  },
  contact: { bn: "যোগাযোগ", en: "Contact" },
  contactUs: { bn: "যোগাযোগ করুন", en: "Contact Us" },
  contactBody: {
    bn: "অর্ডার, কাস্টম ডিজাইন কিংবা যেকোনো জিজ্ঞাসায় আমাদের সাথে যোগাযোগ করুন। আমরা প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত উত্তর দিই।",
    en: "Reach out for orders, custom designs or any questions. We reply daily between 10 AM and 10 PM.",
  },
  location: { bn: "ঠিকানা", en: "Location" },
  locationValue: { bn: "দুমকি, পটুয়াখালী, বাংলাদেশ", en: "Dumki, Patuakhali, Bangladesh" },
  facebook: { bn: "ফেসবুক পেজ", en: "Facebook Page" },
  messageUs: { bn: "মেসেজ পাঠান", en: "Send a Message" },
  footer: { bn: "© ২০২৬ দুমকি ওড়না ঘর। সকল অধিকার সংরক্ষিত।", en: "© 2026 Dumki Orana Ghara. All rights reserved." },
  description: { bn: "বিবরণ", en: "Description" },
  specifications: { bn: "স্পেসিফিকেশন", en: "Specifications" },
  sizeGuide: { bn: "সাইজ গাইড", en: "Size Guide" },
  selectSize: { bn: "সাইজ নির্বাচন করুন", en: "Select size" },
  close: { bn: "বন্ধ করুন", en: "Close" },
  inStock: { bn: "স্টকে আছে", en: "In stock" },
  outOfStock: { bn: "স্টকে নেই", en: "Out of stock" },
  qty: { bn: "পরিমাণ", en: "Qty" },
  off: { bn: "ছাড়", en: "OFF" },
  noProducts: { bn: "কোনো পণ্য পাওয়া যায়নি।", en: "No products found." },
  menu: { bn: "মেনু", en: "Menu" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || "bn";
    setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: keyof typeof DICT) => DICT[key]?.[lang] ?? key;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  return {
    lang: "bn" as Lang,
    setLang: () => undefined,
    t: (key: keyof typeof DICT) => DICT[key]?.bn ?? key,
  };
}

export function pickLocalized(value: { bn: string; en: string }, lang: Lang) {
  return value[lang];
}
