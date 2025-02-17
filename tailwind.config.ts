import type { Config } from "tailwindcss";
type ThemeFunction = (
  path: string,
  defaultValue?: unknown
) => string | undefined;

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      typography: ({ theme }: { theme: ThemeFunction }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.blue.500"),
              "&:hover": {
                color: `${theme("colors.blue.600")}`,
              },
              code: { color: theme("colors.blue.400") },
            },
            "h1,h2": {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
            },
            h3: {
              fontWeight: "600",
            },
            code: {
              color: theme("colors.pink.500"),
              backgroundColor: "var(--background-100)",
              padding: 2,
              borderRadius: 4,
            },
            img: {
              borderRadius: 8,
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme("colors.blue.500"),
              "&:hover": {
                color: `${theme("colors.blue.400")}`,
              },
              code: { color: theme("colors.blue.400") },
            },
            "h1,h2,h3,h4,h5,h6": {
              color: theme("colors.gray.100"),
            },
          },
        },
      }),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
