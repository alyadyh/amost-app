// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: "es5",
  tabWidth: 4,
  useTabs: false,
  semi: false,
  singleQuote: true,
  tailwindConfig: "./styles/tailwind.config.js",
  tailwindPreserveWhitespace: true,
  tailwindPreserveDuplicates: true,
  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss"
  ]
};

module.exports = config;