import type { Interpolation, ThemeUtils } from "@types";

function isTemplateStringArray(a: any): a is TemplateStringsArray {
  return typeof a === "object" && "raw" in a;
}

export function resolveInterpolation(
  utils: ThemeUtils,
  interpolation: Interpolation
): string[] {
  if (interpolation) {
    if (isTemplateStringArray(interpolation)) {
      return Array.from(interpolation);
    } else if (Array.isArray(interpolation)) {
      return interpolation.flatMap((item) => resolveInterpolation(utils, item));
    } else if (typeof interpolation === "function") {
      return resolveInterpolation(utils, interpolation(utils));
    } else {
      return [interpolation.toString()];
    }
  }

  return [];
}
