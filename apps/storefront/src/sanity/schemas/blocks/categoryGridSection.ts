import { defineType, defineField } from "sanity"

export const categoryGridSectionSchema = defineType({
  name: "categoryGridSection",
  title: "Category Grid",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localizedString" }),
  ],
  preview: {
    prepare() {
      return { title: "Category Grid", subtitle: "Category Grid Section (data from Medusa)" }
    },
  },
})
