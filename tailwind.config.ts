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
          accent: "#ff7a00",
          cyan: "#ff7a00",
          sage: "#3F7D58",
          dark: "#000000",
          onyx: "#050505",
          glass: "#0A0A0A",
          paper: "#000000"
        },
      },
      boxShadow: {
        glass: "0 24px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 122, 0, 0.08)",
        halo: "0 18px 50px rgba(255, 122, 0, 0.22)",
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
