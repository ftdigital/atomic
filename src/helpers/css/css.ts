import { Interpolation, ThemeConfig } from "@types";

export function css<Theme extends ThemeConfig = ThemeConfig>(
  ...interpolations: Interpolation<Theme>[]
): Interpolation<ThemeConfig>[] {
  return interpolations;
}
