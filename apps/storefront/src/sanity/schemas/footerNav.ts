import { defineType, defineField, defineArrayMember } from "sanity"

export const footerNavSchema = defineType({
  name: "footerNav",
  title: "Footer Navigation",
  type: "document",
  fields: [
    defineField({
      name: "columns",
      title: "Footer Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "titleEs", type: "string", title: "Column Title (ES)" }),
            defineField({ name: "titleEn", type: "string", title: "Column Title (EN)" }),
            defineField({
              name: "links",
              type: "array",
              title: "Links",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "labelEs", type: "string", title: "Label (ES)" }),
                    defineField({ name: "labelEn", type: "string", title: "Label (EN)" }),
                    defineField({ name: "href", type: "string", title: "URL" }),
                  ],
                  preview: {
                    select: { title: "labelEs", subtitle: "href" },
                    prepare({ title, subtitle }) {
                      return { title: title || "Link", subtitle }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "titleEs" },
            prepare({ title }) {
              return { title: title || "Column" }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer Navigation" }
    },
  },
})
