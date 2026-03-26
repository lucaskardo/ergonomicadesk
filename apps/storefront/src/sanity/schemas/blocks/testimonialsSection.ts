import { defineType, defineField, defineArrayMember } from "sanity"

export const testimonialsSectionSchema = defineType({
  name: "testimonialsSection",
  title: "Testimonios / Testimonials",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localizedString" }),
    defineField({ name: "headingAccent", title: "Heading Accent", type: "localizedString" }),
    defineField({ name: "subtitle", title: "Subtítulo / Subtitle", type: "localizedText" }),
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "localizedText", title: "Quote" }),
            defineField({ name: "author", type: "string", title: "Author" }),
            defineField({ name: "role", type: "localizedString", title: "Role" }),
          ],
          preview: {
            select: { title: "author" },
            prepare({ title }) {
              return { title: title || "Review" }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", title: "Valor (e.g. 500+)" }),
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
  ],
  preview: {
    prepare() {
      return { title: "Testimonials", subtitle: "Testimonials Section" }
    },
  },
})
