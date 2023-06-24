import { Atomic } from "@classes/Atomic";
import { createCssFunction } from "./createCssFunction";

const tokens = new Atomic({
  mode: "css",
  theme: {
    screens: {
      md: "990px",
    },
    mediaQueries: ({ theme }) => ({
      md: `min-width: ${theme("screens.md")}`,
    }),
    colors: { primary: "red" },
    spacing: ({ theme }) => ({
      md: theme("colors.primary"),
    }),
  },
});

const css = createCssFunction(tokens);

it("Should return the correct value", () => {
  const test = css`
    @media (${({ theme }) => theme("mediaQueries.md")}) {
      background-color: ${({ theme }) => theme("colors.primary")};
      color: blue;
    }
  `;

  expect(test).toStrictEqual([
    "@media (var(--mediaQueries-md)) {",
    "background-color: var(--colors-primary);",
    "color: blue;",
    "}",
  ]);
});
