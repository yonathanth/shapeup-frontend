import { MetadataRoute } from "next";

// Define your base URL for ShapeUp Sport Zone
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://shapeupsportzone.com";

// Only include English language as per SEO requirements
const language = "en";

// Define the routes that should be included in the sitemap for ShapeUp Sport Zone
const routes = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/faq",
  "/Register",
  "/Login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Create an array to hold all the sitemap entries
  const sitemap: MetadataRoute.Sitemap = [];

  // Add each route for English only
  for (const route of routes) {
    const path = route;

    sitemap.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority:
        route === "/"
          ? 1.0
          : route === "/about" || route === "/services"
          ? 0.9
          : route === "/Register"
          ? 0.8
          : 0.7,
    });
  }

  return sitemap;
}
