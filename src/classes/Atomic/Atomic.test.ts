import { Atomic } from "./Atomic";

const tokens = new Atomic({
  mode: "css",
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
  expect(tokens).toStrictEqual(tokens);
});

it("Should return the correct value", () => {
  expect(tokens.token("spacing.md").value).toStrictEqual(10);
});
