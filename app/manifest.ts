import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BOLT 3.0 | National 24-hour Hackathon · VIT Vellore",
    short_name: "BOLT 3.0",
    description: "BOLT 3.0, the national flagship 24-hour hackathon at VIT Vellore.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#002147",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
