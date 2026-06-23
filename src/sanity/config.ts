import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "1qlynw8a";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";

export const sanityConfig = defineConfig({
  name: "dumki-studio",
  title: "Dumki Store",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
