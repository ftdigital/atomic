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

const style1 = css<(typeof tokens)["config"]["theme"]>`
  border: red;
  background: blue;
  color: ${({ theme }) => theme("colors.primary.red")};
`;

const style = css<(typeof tokens)["config"]["theme"]>`
  border: red;
  background: blue;
  color: ${({ theme }) => theme("colors.primary.red")};
  ${style1}
`;

it("Should return the correct value", () => {
  console.log(resolveInterpolation(tokens.utils, style));
  expect(resolveInterpolation(tokens.utils, style).join("")).toEqual(
    `
      border: red;
      background: blue;
      color: var(--colors-primary-red);
      border: red;
      background: blue;
      color: var(--colors-primary-red);
  `
  );
});
