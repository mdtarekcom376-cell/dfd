import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleBn",
      title: "Title (Bangla)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titleEn" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
    }),
    defineField({
      name: "descriptionBn",
      title: "Description (Bangla)",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "discountPrice",
      title: "Discount Price (optional)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "BDT",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "titleEn", subtitle: "price", media: "images.0" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `৳ ${subtitle}` : undefined,
        media,
      };
    },
  },
});
