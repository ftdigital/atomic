import { AtomicTokens } from "@classes/AtomicTokens";
import { Atomic, AtomicConfig, TokenUtils, TokensConfig } from "@types";
import { formatTokenVar, formatTokens } from "@utils";

export function atomic<TConfig extends TokensConfig>(
  config: AtomicConfig<TConfig>
): Atomic<TConfig> {
  const tokenUtils: TokenUtils<TConfig> = {
    token: (path) => formatTokenVar(path, config.mode).var,
  };

  const tokens = new AtomicTokens(config.tokens, tokenUtils);

  const variants = Object.fromEntries(
    Object.entries(config.variants ?? {}).map(
      ([variant, { tokens, selector, description }]) => [
        variant,
        new AtomicTokens(tokens, tokenUtils, { selector, description }),
      ]
    )
  );

  return {
    config,
    format: () =>
      formatTokens([tokens, ...Object.values(variants)], config.mode),
    var: (path) => formatTokenVar(path, config.mode).var,
  };
}
