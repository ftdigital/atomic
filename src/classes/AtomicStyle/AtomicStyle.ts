import type { Atomic } from "@classes/Atomic";
import type { RuleSet, ThemeConfig } from "@types";
import { resolveInterpolation } from "@utils";

export class AtomicStyle<Theme extends ThemeConfig> {
  constructor(
    public atomic: Atomic<Theme>,
    public path: string[],
    public ruleSet: RuleSet<Theme>
  ) {}

  get key() {
    return this.path.join(".");
  }

  toString() {
    return resolveInterpolation(this.atomic.utils, this.ruleSet).join("");
  }
}
