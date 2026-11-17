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
    icons: [{ src: "/logos/bolt-logo-white.png", sizes: "any", type: "image/png" }],
  };
}
