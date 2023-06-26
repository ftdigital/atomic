import { css } from "@helpers/css";
import { resolveInterpolations } from "./resolveInterpolations";
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
  expect(resolveInterpolations(tokens.utils, style)).toStrictEqual("");
});
