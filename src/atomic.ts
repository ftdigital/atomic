import { Atomic, AtomicConfig, TokensConfig } from "@types";
import { processTokens, formatTokenVar, formatTokens } from "@utils";

export function atomic<
  Variants extends string,
  TConfig extends TokensConfig<Variants>,
>(config: AtomicConfig<Variants, TConfig>): Atomic<Variants, TConfig> {
  const tokens = processTokens(config.tokens, config.variants);
  const tokensArray = Object.values(tokens);

  return {
    config,
    format: () => formatTokens(tokensArray, config.mode),
    var: (path) => formatTokenVar(path, config.mode).var,
  };
}
