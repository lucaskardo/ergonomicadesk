import { defineType, defineField } from "sanity"

export const blogPreviewSectionSchema = defineType({
  name: "blogPreviewSection",
  title: "Blog Preview",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localizedString" }),
    defineField({
      name: "postCount",
      title: "Number of posts to show",
      type: "number",
      initialValue: 4,
      validation: (rule) => rule.min(1).max(6),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Blog Preview", subtitle: "Blog Preview Section" }
    },
  },
})
