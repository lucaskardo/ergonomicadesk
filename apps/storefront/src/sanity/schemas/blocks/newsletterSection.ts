import { defineType, defineField } from "sanity"

export const newsletterSectionSchema = defineType({
  name: "newsletterSection",
  title: "Newsletter",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localizedString" }),
    defineField({ name: "headingAccent", title: "Heading Accent", type: "localizedString" }),
    defineField({ name: "subtitle", title: "Subtítulo / Subtitle", type: "localizedText" }),
    defineField({ name: "placeholder", title: "Email placeholder", type: "localizedString" }),
    defineField({ name: "buttonText", title: "Button text", type: "localizedString" }),
  ],
  preview: {
    prepare() {
      return { title: "Newsletter", subtitle: "Newsletter Section" }
    },
  },
})
