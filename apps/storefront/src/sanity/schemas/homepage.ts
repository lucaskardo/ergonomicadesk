import { defineField, defineType } from "sanity"

export const homepageSchema = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "announcement",
      title: "Announcement",
      type: "string",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA Text",
      type: "string",
    }),
    defineField({
      name: "heroCtaLink",
      title: "Hero CTA Link",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "heroTitle" },
  },
})
