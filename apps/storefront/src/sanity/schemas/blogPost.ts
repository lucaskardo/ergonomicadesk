import { defineType, defineField, defineArrayMember } from "sanity"

export const blogPostSchema = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description / Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content (Portable Text)",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "string",
                    title: "URL",
                    validation: (rule) => rule.required(),
                  }),
                  defineField({
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        }),
      ],
    }),
    defineField({ name: "tag", title: "Tag", type: "string" }),
    defineField({ name: "readTime", title: "Read Time (e.g. 8 min)", type: "string" }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "author", title: "Author", type: "string", initialValue: "Ergonómica" }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "lang",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Español", value: "es" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      initialValue: "es",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "q", type: "string", title: "Question" }),
            defineField({ name: "a", type: "text", title: "Answer", rows: 4 }),
          ],
          preview: {
            select: { title: "q" },
            prepare({ title }) {
              return { title: title || "FAQ" }
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "lang", media: "mainImage" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Blog Post",
        subtitle: subtitle === "en" ? "🇺🇸 English" : "🇵🇦 Español",
        media,
      }
    },
  },
})
