import { DesignTokens } from "../DesignTokens";

const tokens = DesignTokens.create({
  mediaQueries: {
    mobile: `(max-width: 475px)`,
    tablet: `(min-width: 767px)`,
    desktop: `(min-width: 1024px)`,
    wide: `(min-width: 1228px)`,
  },
})
  .extend(({ create }) => ({
    color: {
      primary: create("red"),
      secondary: create("blue"),
      tertiary: create("green"),
    },
    fontFamily: {
      default: create("arial"),
    },
    fontSize: {
      small: create(16, { tablet: 24 }),
      medium: create(24, { tablet: 32 }),
      large: create(32, { tablet: 48 }),
    },
    lineHeight: {
      small: create(1, { tablet: 1.2 }),
      medium: create(1.2, { tablet: 1.4 }),
      large: create(1.4, { tablet: 1.6 }),
    },
  }))
  .extend(({ create, use }) => ({
    font: {
      small: create(
        `${use("fontFamily.default")} ${use("fontSize.small")} / ${use(
          "lineHeight.small"
        )}`
      ),
      medium: create(
        `${use("fontFamily.default")} ${use("fontSize.medium")} / ${use(
          "lineHeight.medium"
        )}`
      ),
      large: create(
        `${use("fontFamily.default")} ${use("fontSize.large")} / ${use(
          "lineHeight.large"
        )}`
      ),
    },
  }));

it("Should return the correct value", () => {
  expect(tokens.get("color.primary").value()).toStrictEqual("red");
  expect(tokens.get("fontSize.small").value()).toStrictEqual(16);
  expect(tokens.get("fontSize.small").value("tablet")).toStrictEqual(24);
});

it("Should return the correct css variable name", () => {
  expect(tokens.get("color.primary").var).toStrictEqual("var(--color-primary)");
  expect(tokens.get("fontSize.small").var).toStrictEqual(
    "var(--fontSize-small)"
  );
});

it("Should return the correct value when inherit variables", () => {
  expect(tokens.get("font.small").value()).toStrictEqual(
    "var(--fontFamily-default) var(--fontSize-small) / var(--lineHeight-small)"
  );
});

// it("Should return the correct config value with responsive value", () => {
//   expect(tokens.value("fontSize.small.mobile")).toStrictEqual(10);
// });

// it("Should return the correct css variable", () => {
//   expect(tokens.css("color")).toStrictEqual("var(--color)");
// });
