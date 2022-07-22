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
    { mobile: "mobile-query", desktop: "desktop-query" },
    {
      fontSize: { large: { mobile: "red", desktop: "blue" } },
    }
  );

  expect(tokens.vars).toEqual({ fontSize: { large: "var(--fontSize-large)" } });
});
