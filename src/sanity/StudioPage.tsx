import { useEffect, useState } from "react";
import { Studio } from "sanity";

import { sanityConfig } from "./config";

/**
 * Sanity Studio is a browser-only application, so we mount it after the
 * component has hydrated on the client to avoid SSR errors.
 */
export function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Loading Studio…
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <Studio config={sanityConfig} />
    </div>
  );
}
