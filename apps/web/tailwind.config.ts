import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        brand: {
          50: "var(--color-brand-50)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
        },
        footer: {
          bg: "var(--color-footer-bg)",
          text: "var(--color-footer-text)",
          muted: "var(--color-footer-muted)",
          subtle: "var(--color-footer-subtle)",
        },
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
        info: "var(--color-info)",
        focus: "var(--color-focus)",
        sector: {
          1: "var(--color-sector-1)",
          2: "var(--color-sector-2)",
          3: "var(--color-sector-3)",
          4: "var(--color-sector-4)",
          5: "var(--color-sector-5)",
          6: "var(--color-sector-6)",
          7: "var(--color-sector-7)",
          8: "var(--color-sector-8)",
          9: "var(--color-sector-9)",
          10: "var(--color-sector-10)",
        },
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      maxWidth: {
        container: "var(--container-max)",
        content: "var(--content-max)",
      },
    },
  },
  plugins: [],
} satisfies Config;
