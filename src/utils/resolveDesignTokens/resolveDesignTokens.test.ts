import { DesignTokens } from "@classes/DesignTokens";

const tokens = new DesignTokens({
  theme: {
    spacing: {
      md: 10,
      xl: 15,
    },
    colors: {
      red: "red",
    },
  },
}).extend(({ theme }) => ({
  fontSize: {
    md: theme("colors.red"),
  },
}));

it("Should return the correct value", () => {
  expect(tokens.resolved).toStrictEqual(tokens.resolved);
});
