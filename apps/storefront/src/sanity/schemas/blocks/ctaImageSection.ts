import { defineType, defineField, defineArrayMember } from "sanity"

export const ctaImageSectionSchema = defineType({
  name: "ctaImageSection",
  title: "CTA + Image",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "localizedString" }),
    defineField({ name: "title", title: "Título / Title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "titleAccent", title: "Título — acento", type: "localizedString" }),
    defineField({ name: "subtitle", title: "Subtítulo / Subtitle", type: "localizedText" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({
      name: "stats",
      title: "Stats (optional)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", title: "Valor (e.g. 25%)" }),
            defineField({ name: "label", type: "localizedString", title: "Label" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label.es" },
            prepare({ title, subtitle }) {
              return { title: title || "Stat", subtitle }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Derecha / Right", value: "right" },
          { title: "Izquierda / Left", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: {
        list: [
          { title: "Oscuro / Dark", value: "dark" },
          { title: "Claro / Light", value: "light" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    }),
  ],
  preview: {
    select: { title: "title.es", media: "image" },
    prepare({ title, media }) {
      return { title: title || "CTA + Image", subtitle: "CTA Image Section", media }
    },
  },
})
