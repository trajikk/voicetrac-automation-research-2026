import type { MetadataRoute } from "next";

const siteUrl = "https://getorigin.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ];
}
