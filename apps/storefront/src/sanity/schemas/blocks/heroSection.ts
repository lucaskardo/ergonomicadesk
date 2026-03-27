import { defineType, defineField, defineArrayMember } from "sanity"

export const heroSectionSchema = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label (small text above title)",
      type: "localizedString",
    }),
    defineField({
      name: "title",
      title: "Título / Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleAccent",
      title: "Título — palabra en acento",
      type: "localizedString",
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo / Subtitle",
      type: "localizedText",
    }),
    defineField({
      name: "ctaPrimary",
      title: "CTA Primary",
      type: "cta",
    }),
    defineField({
      name: "ctaSecondary",
      title: "CTA Secondary",
      type: "cta",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image (optional)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
  ],
  preview: {
    select: { title: "title.es" },
    prepare({ title }) {
      return { title: title || "Hero", subtitle: "Hero Section" }
    },
  },
})
