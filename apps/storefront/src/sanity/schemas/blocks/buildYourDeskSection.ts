import { defineType, defineField } from "sanity"

export const buildYourDeskSectionSchema = defineType({
  name: "buildYourDeskSection",
  title: "Build Your Desk",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localizedString" }),
    defineField({
      name: "visible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { visible: "visible" },
    prepare({ visible }) {
      return {
        title: "Build Your Desk",
        subtitle: `Build Your Desk Section — ${visible !== false ? "visible" : "hidden"}`,
      }
    },
  },
})
