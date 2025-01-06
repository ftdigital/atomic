import { TokensMap } from "@classes/TokensMap";
import type { TokenUtils, TokensConfig } from "@types";

function isValue(value: any): value is string | number {
  return typeof value === "number" || typeof value === "string";
}

export function processTokens(
  tokensConfig: TokensConfig,
  utils: TokenUtils
): TokensMap {
  const tokens = new TokensMap();
  function loop(obj: Record<string, unknown>, path: string[] = []) {
    for (const key in obj) {
      const resolvedPath = key === "default" ? path : [...path, key];
      const stringifiedPath = resolvedPath.join(".");
      const value = obj[key as keyof typeof obj];
      const resolvedValue = typeof value === "function" ? value(utils) : value;

      if (isValue(resolvedValue)) {
        tokens.set(stringifiedPath, resolvedValue);
      } else {
        loop(resolvedValue, resolvedPath);
      }
    }
  }

  loop(tokensConfig as Record<string, unknown>);

  return tokens;
}
