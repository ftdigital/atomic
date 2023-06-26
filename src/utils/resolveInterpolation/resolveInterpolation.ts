import type { Interpolation, ThemeUtils } from "@types";

function isTemplateStringArray(a: any): a is TemplateStringsArray {
  return typeof a === "object" && "raw" in a;
}

function isInterpolationArray(
  a: any
): a is readonly [TemplateStringsArray, ...Interpolation[]] {
  return a && a[0] && isTemplateStringArray(a[0]);
}

export function resolveInterpolation(
  utils: ThemeUtils,
  interpolation: Interpolation
): string[] {
  if (interpolation) {
    if (isInterpolationArray(interpolation)) {
      const [base, ...args] = interpolation;
      const result = base.flatMap((item, index) => [
        item,
        ...resolveInterpolation(utils, args[index]),
      ]);

      return result;
    } else if (
      Array.isArray(interpolation) ||
      isTemplateStringArray(interpolation)
    ) {
      return interpolation.flatMap((item) => resolveInterpolation(utils, item));
    } else if (typeof interpolation === "function") {
      return resolveInterpolation(utils, interpolation(utils));
    } else {
      return [interpolation.toString()];
    }
  }

  return [];
}
