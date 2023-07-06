import { atomic } from "./atomic";

const tokens = atomic({
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
    blur: ({ theme }) => ({
      md: theme(""),
    }),
  },
}).extendTheme(({ theme }) => ({ font: { sm: theme("blur.md") } }));

it("Should return the correct value", () => {
  expect(tokens).toStrictEqual(tokens);
});

it("Should return the correct value", () => {
  expect(tokens.token("spacing.md").value).toStrictEqual(10);
});
