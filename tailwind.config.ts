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
          accent: "#FFB86C", // Liquid amber
          cyan: "#72E6FF", // iOS glass cyan
          sage: "#A4D6A7", // Soft sage
          dark: "#080A0D", // Graphite black
          onyx: "#11151B", // Elevated graphite
          glass: "#161B22",
          paper: "#F7FAFF" 
        },
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        halo: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 70px rgba(114,230,255,0.12)",
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
