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
          accent: "#E07A5F", // Terracotta
          sage: "#8F9779", // Sage Green
          dark: "#141414", // Charcoal (true neutral)
          onyx: "#1F1F1F", // Onyx
          surface: "#1E1E1E", // Solid surface (Material Dark)
          elevated: "#242424", // Solid elevated surface
          paper: "#F5F5F4" 
        },
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
