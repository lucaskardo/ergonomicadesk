import { defineType, defineField, defineArrayMember } from "sanity"

export const trustBarSectionSchema = defineType({
  name: "trustBarSection",
  title: "Trust Bar",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "emoji", type: "string", title: "Emoji" }),
            defineField({ name: "title", type: "localizedString", title: "Título / Title" }),
            defineField({ name: "subtitle", type: "localizedString", title: "Subtítulo / Subtitle" }),
          ],
          preview: {
            select: { title: "title.es", emoji: "emoji" },
            prepare({ title, emoji }) {
              return { title: `${emoji || ""} ${title || "Item"}` }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Trust Bar", subtitle: "Trust Bar Section" }
    },
  },
})
