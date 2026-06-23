import { createFileRoute } from "@tanstack/react-router";

import { StudioPage } from "@/sanity/StudioPage";

export const Route = createFileRoute("/studio/$")({
  ssr: false,
  component: StudioPage,
});
