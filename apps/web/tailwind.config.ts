import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        header: "var(--color-header)",
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        brand: {
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          200: "var(--color-brand-200)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
          800: "var(--color-brand-800)",
          900: "var(--color-brand-900)",
        },
        footer: {
          bg: "var(--color-footer-bg)",
          text: "var(--color-footer-text)",
          muted: "var(--color-footer-muted)",
          subtle: "var(--color-footer-subtle)",
          border: "var(--color-footer-border)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          50: "var(--color-danger-50)",
          200: "var(--color-danger-200)",
          600: "var(--color-danger-600)",
          700: "var(--color-danger-700)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          50: "var(--color-warning-50)",
          200: "var(--color-warning-200)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          50: "var(--color-success-50)",
          200: "var(--color-success-200)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          50: "var(--color-info-50)",
          200: "var(--color-info-200)",
        },
        focus: "var(--color-focus)",
        "chart-grid": "var(--color-chart-grid)",
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
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "1.5" }],
        sm: ["var(--text-sm)", { lineHeight: "1.6" }],
        base: ["var(--text-base)", { lineHeight: "1.65" }],
        lg: ["var(--text-lg)", { lineHeight: "1.55" }],
        xl: ["var(--text-xl)", { lineHeight: "1.4" }],
        "2xl": [
          "var(--text-2xl)",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ],
        "3xl": [
          "var(--text-3xl)",
          { lineHeight: "1.12", letterSpacing: "-0.02em" },
        ],
        "4xl": [
          "var(--text-4xl)",
          { lineHeight: "1.1", letterSpacing: "-0.025em" },
        ],
        "5xl": [
          "var(--text-5xl)",
          { lineHeight: "1.08", letterSpacing: "-0.03em" },
        ],
        display: [
          "var(--text-display)",
          { lineHeight: "1.08", letterSpacing: "-0.03em" },
        ],
      },
      fontWeight: {
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        header: "var(--shadow-header)",
        focus: "var(--shadow-focus)",
      },
      height: {
        header: "var(--header-height)",
      },
      spacing: {
        header: "var(--header-height)",
      },
      maxWidth: {
        content: "var(--content-max)",
      },
      transitionDuration: {
        DEFAULT: "var(--duration-fast)",
        150: "var(--duration-fast)",
      },
      transitionTimingFunction: {
        DEFAULT: "var(--ease-out)",
      },
    },
  },
  plugins: [],
} satisfies Config;
