import type { Interpolation, ThemeUtils } from "@types";

function isTemplateStringArray(a: any): a is TemplateStringsArray {
  return typeof a === "object" && "raw" in a && typeof a[0] === "string";
}

export function resolveInterpolations(
  utils: ThemeUtils,
  interpolations: Interpolation[]
): string[] {
  function resolveInterpolation(interpolation: Interpolation): string[] {
    if (interpolation) {
      if (isTemplateStringArray(interpolation)) {
        return interpolation.map(
          (string, index) =>
            string + resolveInterpolation(interpolations[index + 1])
        );
      } else if (Array.isArray(interpolation)) {
        return interpolation.flatMap(resolveInterpolation);
      } else if (typeof interpolation === "function") {
        return resolveInterpolation(interpolation(utils));
      } else {
        return [interpolation.toString()];
      }
    }

    return [];
  }

  return interpolations.flatMap(resolveInterpolation);
}
