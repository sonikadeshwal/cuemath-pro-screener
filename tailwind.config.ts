import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { orange: { 500: "#ff6b00" } } } },
} satisfies Config;
