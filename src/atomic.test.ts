import { atomic } from "./atomic";

atomic({
  mode: "css",
  target: "./",
  variants: {
    dark: { selector: ".dark-mode" },
  },
  tokens: {
    blur: ({ get }) => ({
      small: get("colors.primary.red"),
    }),
    colors: {
      primary: {
        red: { default: "red" },
      },
    },
  },
});

it("Should return the correct value", () => {
  expect("tokens").toStrictEqual("tokens");
});
