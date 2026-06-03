import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: "#B45309",
          cyan: "#0E7490",
          sage: "#3F7D58",
          dark: "#09090B",
          onyx: "#FFFFFF",
          glass: "#F4F4F5",
          paper: "#FAFAFA"
        },
      },
      boxShadow: {
        glass: "0 24px 70px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        halo: "0 18px 50px rgba(14, 116, 144, 0.16)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
