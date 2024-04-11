import type { TokenUtils, TokensConfig } from "@types";

export function flattenTokens<TConfig extends TokensConfig>(
  tokens: TConfig,
  utils: TokenUtils<TConfig>
): Map<string, string | number> {
  const map = new Map<string, string | number>();

  function loop(obj: TokensConfig, _path: string[] = []) {
    for (const key in obj) {
      const path = [..._path, key];

      let result = obj[key as keyof typeof obj];

      const resolvedResult = (
        typeof result === "function" ? result(utils) : result
      ) as string | number | TConfig;

      if (
        typeof resolvedResult === "number" ||
        typeof resolvedResult === "string"
      ) {
        const resolvedPath = path.join(".");

        map.set(resolvedPath, resolvedResult);
      } else {
        loop(resolvedResult as TConfig, path);
      }
    }
  }

  loop(tokens);

  return map;
}
