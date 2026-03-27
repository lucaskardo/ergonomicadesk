// Singleton document types — must NOT appear in generic document lists
const SINGLETONS = ["siteSettings", "homepage", "announcementBar", "headerNav", "footerNav"]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const structure = (S: any) =>
  S.list()
    .title("Ergonómica CMS")
    .items([
      // ── Site-wide settings ──────────────────────────────────────────────────
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")
        ),

      S.listItem()
        .title("Announcement Bar")
        .child(
          S.document()
            .schemaType("announcementBar")
            .documentId("announcementBar")
            .title("Announcement Bar")
        ),

      S.divider(),

      // ── Navigation ─────────────────────────────────────────────────────────
      S.listItem()
        .title("Header Navigation")
        .child(
          S.document().schemaType("headerNav").documentId("headerNav").title("Header Navigation")
        ),

      S.listItem()
        .title("Footer Navigation")
        .child(
          S.document().schemaType("footerNav").documentId("footerNav").title("Footer Navigation")
        ),

      S.divider(),

      // ── Pages ───────────────────────────────────────────────────────────────
      S.listItem()
        .title("Homepage")
        .child(
          S.document().schemaType("homepage").documentId("homepage").title("Homepage")
        ),

      S.divider(),

      // ── Blog ────────────────────────────────────────────────────────────────
      S.listItem()
        .title("Blog Posts")
        .child(S.documentTypeList("blogPost").title("Blog Posts")),

      // ── Comercial ───────────────────────────────────────────────────────────
      S.listItem()
        .title("Proyectos Comerciales")
        .child(S.documentTypeList("commercialSector").title("Proyectos Comerciales")),

      S.divider(),

      // ── Remaining document types (filtered — no singletons) ─────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...S.documentTypeListItems().filter(
        (item: any) =>
          !SINGLETONS.includes(item.getId() as string) &&
          item.getId() !== "blogPost" &&
          item.getId() !== "commercialSector"
      ),
    ])
