import type { SchemaTypeDefinition } from "sanity";

import { category } from "./category";
import { product } from "./product";

export const schemaTypes: SchemaTypeDefinition[] = [product, category];
