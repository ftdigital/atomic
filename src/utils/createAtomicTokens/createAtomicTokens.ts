import type { Atomic } from "@classes/Atomic";
import { AtomicToken } from "@classes/AtomicToken";
import type { ThemeConfig, ThemeResolved } from "@types";

export function createAtomicTokens<Theme extends ThemeConfig>(
  atomic: Atomic<Theme>
) {
  function loop(obj: ThemeConfig, _path: string[] = []) {
    for (const key in obj) {
      let result = obj[key as keyof typeof obj];

      const resolvedResult = (
        typeof result === "function" ? result(atomic.utils) : result
      ) as string | number | ThemeResolved<Theme>;

      const path = [..._path, key];

      if (
        typeof resolvedResult === "number" ||
        typeof resolvedResult === "string"
      ) {
        const token = new AtomicToken(atomic, path, resolvedResult);
        atomic.tokensMap.set(token.key, token);
      } else {
        loop(resolvedResult as ThemeConfig, path);
      }
    }
  }

  loop(atomic.config.theme);

  return atomic.tokensMap;
}
