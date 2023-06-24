import type { Atomic } from "@classes/Atomic";
import type { Interpolation, ThemeConfig } from "@types";
import { resolveInterpolation } from "@utils";

export function createCssFunction<Theme extends ThemeConfig>(
  atomic: Atomic<Theme>
) {
  return function css(...interpolations: Interpolation<Theme>[]): string[] {
    const resolvedInterpolations = interpolations.map((interpolation) =>
      resolveInterpolation(atomic.utils, interpolation).flatMap((rule) => rule)
    );

    const [base, ...args] = resolvedInterpolations;

    if (!base) return [];

    return base
      .map((partial, index) => {
        const arg = args[index];
        return partial + (arg?.toString?.() ?? "");
      })
      .join("")
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean);
  };
}
