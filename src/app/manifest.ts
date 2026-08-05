import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "E-CON Building Centre",
    short_name: "E-CON",
    description: "E-CON Precast System - Powered by Engineers. Trusted by Families.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2ba75b",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
