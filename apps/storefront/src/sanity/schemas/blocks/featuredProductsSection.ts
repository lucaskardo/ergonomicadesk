import { defineType, defineField } from "sanity"

export const featuredProductsSectionSchema = defineType({
  name: "featuredProductsSection",
  title: "Productos Destacados",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localizedString" }),
    defineField({ name: "headingAccent", title: "Heading Accent", type: "localizedString" }),
  ],
  preview: {
    prepare() {
      return { title: "Featured Products", subtitle: "Featured Products Section (data from Medusa)" }
    },
  },
})
