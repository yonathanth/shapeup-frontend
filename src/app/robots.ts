import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/en/", "/favicon.ico", "/Images/", "/assets/"],
        disallow: ["/am/", "/admin/", "/api/", "/user/", "/private/", "/*?*"],
      },
    ],
    sitemap: "https://shapeupsportzone.com/sitemap.xml",
  };
}
