import { Tokens } from "../Tokens";

it("Should return the correct config value", () => {
  const tokens = new Tokens({ mobile: "20px" }, { color: "red" });
  expect(tokens.config.color).toStrictEqual("red");
});

it("Should return all mediaTypes", () => {
  const tokens = new Tokens({ mobile: "20px" }, { color: "red" });
  expect(tokens.mediaTypes).toStrictEqual(["mobile"]);
});

it("Should return all vars (without media-type names)", () => {
  const tokens = new Tokens(
    {
      mobile: "mobile-query",
      tablet: "tablet-query",
      desktop: "desktop-query",
    },
    {
      fontSize: {
        content: {
          small: { mobile: "11px", tablet: "12px" },
          medium: { mobile: "11px", tablet: "12px" },
          large: { mobile: "11px", tablet: "12px" },
        },
        heading: {
          small: { mobile: "11px", tablet: "12px" },
          medium: { mobile: "11px", tablet: "12px" },
          large: { mobile: "11px", tablet: "12px" },
        },
      },
    }
  );

  expect(tokens.vars).toEqual({
    fontSize: {
      content: {
        small: "var(--fontSize-content-small)",
        medium: "var(--fontSize-content-medium)",
        large: "var(--fontSize-content-large)",
      },
      heading: {
        small: "var(--fontSize-heading-small)",
        medium: "var(--fontSize-heading-medium)",
        large: "var(--fontSize-heading-large)",
      },
    },
  });
});

it("Should be able to create css", () => {
  const tokens = new Tokens(
    { mobile: "mobile-query", tablet: "tablet-query" },
    {
      color: "red",
    }
  );

  expect(tokens.css()).toContain(":root {\n--color: red;\n}");
});
