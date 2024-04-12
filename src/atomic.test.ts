import { atomic } from "./atomic";

const { get } = atomic({
  mode: "css",
  target: "./",
  variants: {
    dark: { selector: ".dark-mode" },
  },
  tokens: {
    blur: ({ get }) => ({
      small: get(""),
    }),
    colors: {
      primary: {
        red: { default: "red" },
      },
    },
  },
});

get("blur.small");

it("Should return the correct value", () => {
  expect("tokens").toStrictEqual("tokens");
});
