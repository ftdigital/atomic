import { TokensMap } from "@classes/TokensMap";
import { Atomic, AtomicConfig, TokenUtils, TokensConfig } from "@types";
import { formatTokenVar, formatTokens } from "@utils";

export function atomic<TConfig extends TokensConfig>(
  config: AtomicConfig<TConfig>
): Atomic<TConfig> {
  const utils: TokenUtils = {
    get: (path) => formatTokenVar(path, config.mode).var,
  };

  const defaultTokens = TokensMap.init(utils, config.tokens);
  const variantTokens = Object.entries(config.variants ?? {}).map(
    ([variant, { tokens, selector, description }]) =>
      [
        variant,
        TokensMap.init(utils, tokens, { selector, description }),
      ] as const
  );

  const tokens = new Map<string, TokensMap>([
    ["default", defaultTokens],
    ...variantTokens,
  ]);

  const tokensArray = Array.from(tokens.values());

  return {
    config,
    format: () => formatTokens(tokensArray, config.mode),
    get: (path) => formatTokenVar(path, config.mode).var,
    addVariant: (name: string, variantConfig) =>
      atomic<TConfig>({
        ...config,
        variants: { ...config.variants, [name]: variantConfig },
      }),
  };
}
