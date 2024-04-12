import { TokensMap } from "@classes/TokensMap";
import { Atomic, AtomicConfig, TokenUtils, TokensConfig } from "@types";
import { processTokens, formatTokenVar, formatTokens } from "@utils";

export function atomic<
  Variant extends string,
  TConfig extends TokensConfig<Variant>,
>(config: AtomicConfig<Variant, TConfig>): Atomic<Variant, TConfig> {
  const tokens = Object.fromEntries(
    ["default", ...Object.keys(config.variants ?? {})].map((variant) => [
      variant,
      new TokensMap(),
    ])
  ) as Record<"default" | Variant, TokensMap>;

  const utils: TokenUtils = {
    get: (path) => formatTokenVar(path, config.mode).var,
  };

  processTokens(tokens, config.tokens, config.variants!, utils);

  const tokensArray = Object.values(tokens);

  return {
    config,
    format: () => formatTokens(tokensArray, config.mode),
    get: (path) => formatTokenVar(path, config.mode).var,
  };
}
