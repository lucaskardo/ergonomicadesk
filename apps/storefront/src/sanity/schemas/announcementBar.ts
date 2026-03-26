import { defineType, defineField } from "sanity"

export const announcementBarSchema = defineType({
  name: "announcementBar",
  title: "Announcement Bar",
  type: "document",
  fields: [
    defineField({
      name: "visible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "object",
      fields: [
        defineField({ name: "prefix", type: "localizedString", title: "Prefix text" }),
        defineField({ name: "highlight", type: "localizedString", title: "Highlighted text" }),
        defineField({ name: "suffix", type: "localizedString", title: "Suffix text" }),
      ],
    }),
    defineField({ name: "link", title: "Link (optional)", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Announcement Bar" }
    },
  },
})
