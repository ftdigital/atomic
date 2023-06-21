/** @type {import('@classes/DesignTokens')} */
const { DesignTokens } = require("../../dist/design-tokens.umd");

const path = require("path");

module.exports = new DesignTokens({
  exports: {
    sass: path.resolve(__dirname, "tokens.scss"),
    css: path.resolve(__dirname, "tokens.css"),
  },
  theme: {
    spacing: {
      md: 1,
    },
    colors: {
      primary: {
        red: "red",
      },
    },
  },
});
