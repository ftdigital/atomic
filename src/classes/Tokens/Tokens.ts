import { TokensConfig, TokenVars } from "@types";
import { tokensConfigToTokens, tokensToVars, createCss } from "@utils";

export class Tokens<
  MediaType extends string,
  TConfig extends TokensConfig<MediaType>
> {
  mediaQueries: Record<MediaType, string>;
  config: TConfig;

  constructor(mediaQueries: Record<MediaType, string>, config: TConfig) {
    this.mediaQueries = mediaQueries;
    this.config = config;
  }

  get mediaTypes() {
    return Object.keys(this.mediaQueries) as MediaType[];
  }

  get tokens() {
    return tokensConfigToTokens(this.config, this.mediaTypes);
  }

  get vars() {
    return tokensToVars<MediaType, TConfig>(this.tokens);
  }

  css() {
    return createCss(this.tokens, this.mediaQueries);
  }

  private mergeConfig<T extends TokensConfig>(tokens: T) {
    return new Tokens(this.mediaQueries, {
      ...this.config,
      ...tokens,
    });
  }

  add<K extends string, T extends TokensConfig<MediaType>>(
    key: K,
    config: T | ((vars: TokenVars<TConfig, MediaType>) => T)
  ) {
    const resolvedConfig =
      typeof config === "function" ? config(this.vars) : config;
    const addedTokens = { [key]: resolvedConfig } as Record<K, T>;
    return this.mergeConfig(addedTokens);
  }
}
