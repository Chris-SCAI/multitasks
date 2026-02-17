import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://multitasks.fr";
  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-02-17"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-02-17"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/cgu`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
