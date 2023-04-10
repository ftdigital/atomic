import { DesignTokens } from "@classes/DesignTokens";

const designTokens = DesignTokens.create({
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

export default designTokens;
