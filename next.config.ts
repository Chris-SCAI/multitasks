import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.stripe.com; frame-src https://js.stripe.com;",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        { key: "X-XSS-Protection", value: "0" },
      ],
    },
    // CORS : Access-Control-Allow-Origin conditionnel (selon l'environnement dev/prod)
    // n'est pas possible via les headers statiques de next.config.ts.
    // Le CORS dynamique (vérification de l'origine) sera géré dans src/middleware.ts.
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
        {
          key: "Access-Control-Allow-Credentials",
          value: "true",
        },
      ],
    },
  ],
};

export default nextConfig;
