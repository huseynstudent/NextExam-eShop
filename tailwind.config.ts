import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#26262b",
        subtle: "#7c7c85",
        line: "#e7e5e1",
        cream: "#f4f2ef",
        accent: {
          DEFAULT: "#e0673e",
          dark: "#c85a34",
        },
      },
      fontFamily: {
        sans: ["var(--font-jost)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.18em",
      },
      borderRadius: {
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
