const excludedPaths = [
  "/checkout/*",
  "/cart",
  "/account/*",
  "/studio/*",
  "/api/*",
]

module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "https://ergonomicadesk.com",
  generateRobotsTxt: true,
  exclude: [...excludedPaths, "/[sitemap]"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: excludedPaths },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
    ],
  },
}
