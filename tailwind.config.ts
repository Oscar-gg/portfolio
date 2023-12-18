import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#000000",
        secondary: "#FFFFFF",
        "palette-blue": "#0070F3",
        highlight: "#FCA311",
        tertiary: "#14213D",
        quaternary: "#E5E5E5",
      },
    },
  },
  plugins: [],
} satisfies Config;
