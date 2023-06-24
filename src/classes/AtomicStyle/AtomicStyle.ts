import type { Atomic } from "@classes/Atomic";
import type { ThemeConfig } from "@types";

export class AtomicStyle<Theme extends ThemeConfig> {
  constructor(
    public atomic: Atomic<Theme>,
    public path: string[],
    public style: string[]
  ) {}

  get key() {
    return this.path.join(".");
  }

  toString() {
    return this.style.join("\n");
  }
}
