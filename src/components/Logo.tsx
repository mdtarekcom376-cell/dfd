import { useState } from "react";
import { BRAND_LOGO_URL, BRAND_LOGO_WHITE_URL } from "@/lib/brand";

export function Logo({ size = 36, variant = "default" }: { size?: number; variant?: "default" | "white" }) {
  const [failed, setFailed] = useState(false);
  const src = variant === "white" ? BRAND_LOGO_WHITE_URL : BRAND_LOGO_URL;

  if (failed) {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-display"
        style={{ height: size, width: size, fontSize: size * 0.46 }}
      >
        দ
      </span>
    );
  }
  return (
    <img
      src={src}
      alt="দুমকি ওড়না ঘর"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-contain"
      style={{ height: size, width: size }}
    />
  );
}
