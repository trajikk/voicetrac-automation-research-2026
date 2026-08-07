import type { MetadataRoute } from "next";

const siteUrl = "https://originvisibility.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/about", "/contact"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
