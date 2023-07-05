import type { Atomic } from "@classes/Atomic";
import { AtomicStyle } from "@classes/AtomicStyle";
import type { StylesConfig, ThemeConfig } from "@types";

export function createAtomicStyles<Theme extends ThemeConfig>(
  atomic: Atomic<Theme>,
  config: StylesConfig<Theme>
) {
  const stylesMap = atomic.stylesMap;

  function loop(obj: StylesConfig<Theme>, _path: string[] = []) {
    for (const key in obj) {
      let result = obj[key as keyof typeof obj];

      const path = [..._path, key];

      if (Array.isArray(result)) {
        const style = new AtomicStyle(atomic, path, result);
        stylesMap.set(style.key, style);
      } else {
        loop(result as StylesConfig<Theme>, path);
      }
    }
  }

  loop(config);

  return stylesMap;
}
