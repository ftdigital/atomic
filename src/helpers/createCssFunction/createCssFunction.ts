import { createThemeUtils } from "@helpers/createThemeUtils";
import { Interpolation, ThemeConfig } from "@types";

export function createCssFunction<Theme extends ThemeConfig>(theme: Theme) {
  function resolveInterpolation(interpolation: Interpolation<Theme>) {
    if (!interpolation) return "";
    if (typeof interpolation === "function") {
      return interpolation(createThemeUtils(theme))?.toString();
    }

    return interpolation?.toString();
  }

  return function css(...interpolations: Interpolation<Theme>[]) {
    const [base, ...args] = interpolations as [
      TemplateStringsArray,
      ...Interpolation<Theme>[]
    ];

    return base
      .flatMap((partial, index) => {
        const interpolation = args[index];
        return partial + resolveInterpolation(interpolation);
      })
      .filter(Boolean)
      .join("");
  };
}
