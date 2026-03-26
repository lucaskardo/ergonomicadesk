import { defineType, defineField } from "sanity"

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Brand Name", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp Number", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Address", type: "localizedString" }),
    defineField({ name: "hours", title: "Business Hours", type: "localizedString" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url", title: "Instagram" }),
        defineField({ name: "facebook", type: "url", title: "Facebook" }),
        defineField({ name: "tiktok", type: "url", title: "TikTok" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" }
    },
  },
})
