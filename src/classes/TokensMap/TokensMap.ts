import { AtomicTokensMeta, TokensConfig, TokenUtils } from "@types";
import { DeepPartial } from "../../types.utils";

function isValue(value: any): value is string | number {
  return typeof value === "number" || typeof value === "string";
}

export function getTokensConfigEntries(
  tokensConfig: TokensConfig,
  utils: TokenUtils
) {
  const map = new Map<string, string | number>();
  function loop(obj: Record<string, unknown>, path: string[] = []) {
    for (const key in obj) {
      const resolvedPath = key === "default" ? path : [...path, key];
      const stringifiedPath = resolvedPath.join(".");
      const value = obj[key as keyof typeof obj];
      const resolvedValue = typeof value === "function" ? value(utils) : value;

      if (isValue(resolvedValue)) {
        map.set(stringifiedPath, resolvedValue);
      } else {
        loop(resolvedValue, resolvedPath);
      }
    }
  }

  loop(tokensConfig as Record<string, unknown>);

  return map;
}

export class TokensMap extends Map<string, string | number> {
  constructor(
    tokens?: Map<string, string | number>,
    public meta: AtomicTokensMeta = {}
  ) {
    super(tokens);
  }

  public static init(
    utils: TokenUtils,
    config: DeepPartial<TokensConfig>,
    meta: AtomicTokensMeta = {}
  ) {
    return new TokensMap(getTokensConfigEntries(config, utils), meta);
  }

  group() {
    const entries = Array.from(this);

    return entries.reduce((map, token) => {
      const [path] = token;
      const [type] = path.split(".");

      if (!type) return map;

      if (type && !map.has(type)) map.set(type, []);
      map.set(type, [...(map.get(type) ?? []), token]);
      return map;
    }, new Map<string, [string, string | number][]>());
  }
}
