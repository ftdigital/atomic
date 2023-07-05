import { Atomic } from "@classes/Atomic";
import { AtomicConfig, AtomicInstance, ThemeConfig } from "@types";

export function atomic<Theme extends ThemeConfig>(
  config: AtomicConfig<Theme>
): AtomicInstance<Theme> {
  const { extendTheme, theme, token } = new Atomic(config);

  return {
    extendTheme,
    theme,
    token,
  } as AtomicInstance<Theme>;
}

atomic({
  mode: "scss",
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
}).extendTheme(({ theme }) => ({
  font: {
    md: theme("colors.primary.red"),
  },
}));
