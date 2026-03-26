import { defineType, defineField, defineArrayMember } from "sanity"

export const homepageSchema = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "trustBarSection" }),
        defineArrayMember({ type: "categoryGridSection" }),
        defineArrayMember({ type: "featuredProductsSection" }),
        defineArrayMember({ type: "buildYourDeskSection" }),
        defineArrayMember({ type: "testimonialsSection" }),
        defineArrayMember({ type: "ctaImageSection" }),
        defineArrayMember({ type: "blogPreviewSection" }),
        defineArrayMember({ type: "newsletterSection" }),
      ],
      options: {
        insertMenu: {
          views: [{ name: "list" }],
        },
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" }
    },
  },
})
