import { defineType, defineField } from "sanity"

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "es", type: "string", title: "Español" }),
    defineField({ name: "en", type: "string", title: "English" }),
  ],
})

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({ name: "es", type: "text", title: "Español", rows: 3 }),
    defineField({ name: "en", type: "text", title: "English", rows: 3 }),
  ],
})

// Reusable CTA object (text + href, bilingual)
export const ctaObject = defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Texto / Text",
      type: "localizedString",
    }),
    defineField({ name: "href", title: "Link", type: "string" }),
  ],
  preview: {
    select: { title: "text.es", subtitle: "href" },
    prepare({ title, subtitle }) {
      return { title: title || "CTA", subtitle }
    },
  },
})
