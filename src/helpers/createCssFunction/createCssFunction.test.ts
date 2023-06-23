import { createCssFunction } from "./createCssFunction";

const css = createCssFunction({ colors: { primary: "red" } } as const);

it("Should return the correct value", () => {
  const test = css`
    ${({ theme }) => theme("colors.primary")};
    background-color: ${({ theme }) => theme("colors.primary")};
    color: ${({ theme }) => theme("colors.primary")};
  `;

  expect(test).toStrictEqual(`
    red;
    background-color: red;
    color: red;
  `);
});
