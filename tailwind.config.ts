import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,html}"],
  prefix: "tw-",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
