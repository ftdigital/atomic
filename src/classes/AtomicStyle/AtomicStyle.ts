import type { Atomic } from "@classes/Atomic";
import type { Interpolation, ThemeConfig } from "@types";
import { resolveInterpolations } from "@utils";

export class AtomicStyle<Theme extends ThemeConfig> {
  constructor(
    public atomic: Atomic<Theme>,
    public path: string[],
    public interpolations: Interpolation<Theme>[]
  ) {}

  get key() {
    return this.path.join(".");
  }

  toString() {
    return resolveInterpolations(this.atomic.utils, this.interpolations);
  }
}
