import { css } from "@helpers/css";
import { resolveInterpolation } from "./resolveInterpolation";
import { Atomic } from "@classes/Atomic";

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

const style = css<(typeof tokens)["config"]["theme"]>`
  border: red;
  background: blue;
  color: ${({ theme }) => theme("colors.primary.red")};
`;

it("Should return the correct value", () => {
  expect(
    resolveInterpolation(tokens.utils, style)
      .join("")
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean)
  ).toEqual([
    `border: red;`,
    `background: blue;`,
    `color: var(--colors-primary-red);`,
  ]);
});
