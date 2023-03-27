import { Tokens } from "../Tokens";

const tokens = new Tokens(
  { mediaQueries: { mobile: "20px" } },
  {
    color: "red",
    fontSize: {
      small: { mobile: 10, tablet: 20 },
      normal: { mobile: 10, tablet: 20 },
      large: { mobile: 10, tablet: 20 },
    },
    fontFamily: "arial",
  }
).extend(({ css }) => {
  return {
    test: css("fontSize.large.mobile"),
  };
});

it("Should return the correct config value", () => {
  expect(tokens.value("color")).toStrictEqual("red");
});

it("Should return the correct config value with responsive value", () => {
  expect(tokens.value("fontSize.small.mobile")).toStrictEqual(10);
});

it("Should return the correct css variable", () => {
  expect(tokens.css("color")).toStrictEqual("var(--color)");
});
