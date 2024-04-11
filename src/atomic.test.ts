import { atomic } from "./atomic";

const tokens = atomic({
  mode: "css",
  target: "./",
  tokens: {
    spacing: {
      md: 10,
    },
    colors: {
      primary: {
        red: "red",
      },
    },
  },
  variants: [
    { selector: ".dark-mode", tokens: { colors: { primary: { red: ("") => "" } } } },
  ],
});

tokens.var("colors.primary.red");

console.log(tokens.format());

it("Should return the correct value", () => {
  expect(tokens).toStrictEqual(tokens);
});
