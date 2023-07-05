import { Interpolation, RuleSet, ThemeConfig } from "@types";

export function css<Theme extends ThemeConfig>(
  ...interpolations: Interpolation<Theme>[]
): RuleSet<Theme> {
  return interpolations;
}
