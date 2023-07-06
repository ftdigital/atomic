import { Atomic } from "@classes/Atomic";
import { AtomicConfig, AtomicInstance, ThemeConfig } from "@types";

export function atomic<Theme extends ThemeConfig>(
  config: AtomicConfig<Theme>
): AtomicInstance<Theme> {
  return new Atomic(config) as AtomicInstance<Theme>;
}
