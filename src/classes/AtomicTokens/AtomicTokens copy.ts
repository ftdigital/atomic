import { AtomicTokensMeta, TokenUtils, TokensConfig } from "@types";
import { flattenTokens } from "@utils";

export class AtomicTokens<
  Variants extends string = never,
  TConfig extends TokensConfig = TokensConfig,
> extends Map<string, string | number> {
  constructor(
    tokens: TConfig,
    utils: TokenUtils<TConfig>,
    public meta: AtomicTokensMeta = {}
  ) {
    const flattenedTokens = flattenTokens(tokens, utils);

    super(flattenedTokens);
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
