import { DesignTokens } from "@classes/DesignTokens";

const designTokens = new DesignTokens({
  theme: {
    spacing: {
      md: 10,
    },
    colors: {
      primary: {
        red: "red",
      },
    },
  },
});

it("Should return the correct value", () => {
  expect(designTokens).toStrictEqual(designTokens);
});

it("Should return the correct value", () => {
  expect(designTokens.get("spacing.md").value).toStrictEqual(10);
});
