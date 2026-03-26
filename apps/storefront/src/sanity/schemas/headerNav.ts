import { defineType, defineField, defineArrayMember } from "sanity"

export const headerNavSchema = defineType({
  name: "headerNav",
  title: "Header Navigation",
  type: "document",
  fields: [
    defineField({
      name: "links",
      title: "Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "labelEs", type: "string", title: "Label (ES)" }),
            defineField({ name: "labelEn", type: "string", title: "Label (EN)" }),
            defineField({ name: "handle", type: "string", title: "Category handle (e.g. standing-desks)" }),
          ],
          preview: {
            select: { title: "labelEs", subtitle: "handle" },
            prepare({ title, subtitle }) {
              return { title: title || "Link", subtitle }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Header Navigation" }
    },
  },
})
