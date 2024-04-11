import { atomic } from "./atomic";

const tokens = atomic({
  mode: "css",
  target: "./",
  variants: {
    dark: { selector: ".dark-mode" },
  },
  tokens: {
    spacing: {
      md: { default: 10, dark: 20 },
    },
    colors: {
      primary: {
        red: "red",
      },
    },
  },
});

it("Should return the correct value", () => {
  expect(tokens).toStrictEqual(tokens);
});
