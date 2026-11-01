import js from "@eslint/js";
import tsPlugin from "typescript-eslint";

export default tsPlugin.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/public/**",
      "scripts/**"
    ]
  },
  js.configs.recommended,
  ...tsPlugin.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": ["warn", { "allow": ["warn", "error", "info", "log"] }]
    }
  }
);
