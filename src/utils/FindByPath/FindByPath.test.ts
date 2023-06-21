import { FindByPath } from "./FindByPath";

it("Should return the correct value", () => {
  expect(
    FindByPath("colors.primary.test".split("."), {
      colors: { primary: { test: 10 } },
    })
  ).toStrictEqual(10);
});
