import { defineType, defineField, defineArrayMember } from "sanity"

export const commercialSectorSchema = defineType({
  name: "commercialSector",
  title: "Sector Comercial",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título / Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.es" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo / Subtitle",
      type: "localizedText",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "description",
      title: "Descripción SEO / SEO Description",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "spaces",
      title: "Espacios / Spaces",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nombre / Name", type: "localizedString", validation: (rule) => rule.required() }),
            defineField({ name: "slug", title: "Slug (Fase 2)", type: "string" }),
            defineField({ name: "description", title: "Descripción / Description", type: "localizedText" }),
            defineField({ name: "icon", title: "Emoji icon", type: "string" }),
          ],
          preview: {
            select: { title: "name.es", subtitle: "icon" },
            prepare({ title, subtitle }) {
              return { title: `${subtitle ?? ""} ${title ?? "Espacio"}`.trim() }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Galería / Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "catalogFile",
      title: "Catálogo (PDF)",
      type: "file",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Pregunta / Question", type: "localizedString" }),
            defineField({ name: "answer", title: "Respuesta / Answer", type: "localizedText" }),
          ],
          preview: {
            select: { title: "question.es" },
            prepare({ title }) {
              return { title: title || "FAQ" }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "localizedString",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "localizedText",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "localizedString",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
      initialValue: "https://wa.me/50769533776",
    }),
  ],
  orderings: [
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title.es", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.es", subtitle: "slug.current", media: "heroImage" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Sector", subtitle: subtitle, media }
    },
  },
})
