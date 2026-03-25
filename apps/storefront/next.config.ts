import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            // CSP: unsafe-inline/eval required by Next.js and GTM.
            // Tighten to nonce-based CSP post-launch if needed.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.meilisearch.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.facebook.com https://api.resend.com https://graph.facebook.com https://*.meilisearch.com https://challenges.cloudflare.com",
              "font-src 'self' https://api.fontshare.com https://cdn.fontshare.com",
              "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com https://connect.facebook.net",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
