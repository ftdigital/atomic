import { writeFileSync } from "fs";
import { atomic } from "./atomic";

function generateTokens() {
  return atomic({
    target: "./variables.css",
    mode: "css",
    tokens: {
      screens: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1540,
      },
      mediaQueries: ({ get }) => ({
        sm: `"min-width: #{${get("screens.sm")}}px"`,
        md: `"min-width: #{${get("screens.md")}}px"`,
        lg: `"min-width: #{${get("screens.lg")}}px"`,
        xl: `"min-width: #{${get("screens.xl")}}px"`,
        "2xl": `"min-width: #{${get("screens.2xl")}}px"`,
      }),
      // spacing: {
      //   px: '1px',
      //   0: '0px',
      //   0.5: rem(2),
      //   1: rem(4),
      //   1.5: rem(6),
      //   2: rem(8),
      //   2.5: rem(10),
      //   3: rem(12),
      //   3.5: rem(14),
      //   4: rem(16),
      //   5: rem(20),
      //   6: rem(24),
      //   7: rem(8),
      //   8: rem(32),
      //   9: rem(36),
      //   10: rem(40),
      //   11: rem(44),
      //   12: rem(48),
      //   14: rem(56),
      //   16: rem(64),
      //   20: rem(80),
      //   24: rem(96),
      //   28: rem(112),
      //   32: rem(128),
      //   36: rem(144),
      //   40: rem(160),
      //   44: rem(176),
      //   48: rem(192),
      //   52: rem(208),
      //   56: rem(224),
      //   60: rem(240),
      //   64: rem(256),
      //   72: rem(288),
      //   80: rem(320),
      //   96: rem(384),
      // },
      colors: {
        primary: {
          green: {
            default: "#414B0E",
            dark: "#123C38",
            light: "#8EA499",
            test: "blue",
          },
          yellow: { default: "#FCB31E", dark: "#CB6F18" },
        },
        secondary: {
          blue: { default: "#EBDECC", dark: "#EBDECC" },
        },
        semantic: {
          success: {
            default: "green",
          },
          warning: {
            default: "green",
          },
          error: {
            default: "green",
          },
          info: {
            default: "green",
          },
        },
        neutrals: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
          950: "#0C0A09",
          bone: "#EBDECC",
          isabelline: "#F9F6F0",
        },
        ui: {
          border: {
            default: ({ get }) => get("colors.neutrals.300"),
            dark: ({ get }) => get("colors.neutrals.400"),
          },
          link: {
            default: ({ get }) => get("colors.secondary.blue"),
            hover: ({ get }) => get("colors.secondary.blue.darken"),
          },
          button: {
            default: ({ get }) => get("colors.secondary.blue"),
            hover: ({ get }) => get("colors.secondary.blue.darken"),
          },
        },
      },
      fontFamily: {
        quicksand: "var(--font-quicksand)",
      },
      fontSize: {
        "3xs": 10,
        "2xs": 12,
        xs: 14,
        base: 16,
        sm: 16,
        md: 18,
        lg: 20,
        xl: 24,
        "2xl": 32,
        "3xl": 36,
        "4xl": 48,
        "5xl": 64,
        "6xl": 72,
        "7xl": 96,
        "8xl": 128,
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        "2lg": "24px",
        full: "99999px",
      },
      boxShadow: {
        md: "0 0 32px 0px rgba(0, 0, 0, 0.1);",
        lg: "0 4px 48px rgba(0, 0, 0, 0.05)",
      },
    },
  });
}

it("Should return the correct value", () => {
  let atomic = generateTokens();

  atomic = atomic.addVariant("dark", {
    selector: ".dark-mode",
    tokens: {
      colors: { neutrals: { "100": "red" } },
    },
  });

  const fileContents = atomic.format();
  writeFileSync(atomic.config.target, fileContents, "utf8");

  expect("tokens").toStrictEqual("tokens");
});
