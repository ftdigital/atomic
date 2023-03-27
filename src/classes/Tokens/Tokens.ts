import { TokenKey, TokensConfig, TokensOptions } from "@types";
import { tokensConfigToTokensMap, createCss } from "@utils";

export class Tokens<
  MediaType extends string = string,
  TConfig extends TokensConfig<MediaType> = TokensConfig
> {
  public options: TokensOptions<MediaType>;
  private config: TConfig;

  constructor(options: TokensOptions<MediaType>, config: TConfig) {
    this.options = options;
    this.config = config;
  }

  private get mediaTypes() {
    const { mediaQueries } = this.options;
    return mediaQueries ? (Object.keys(mediaQueries) as MediaType[]) : [];
  }

  private get map() {
    return tokensConfigToTokensMap(this.config, this.mediaTypes);
  }

  public get tokens() {
    return Array.from(this.map.values());
  }

  private merge<T extends TokensConfig>(tokens: T) {
    return new Tokens(this.options, {
      ...this.config,
      ...tokens,
    });
  }

  private find(path: TokenKey<TConfig>) {
    return this.map.get(path);
  }

  public generateCss() {
    return createCss(this);
  }

  public extend<T extends TokensConfig<MediaType>>(
    config: T | ((tools: Pick<Tokens<MediaType, TConfig>, "css">) => T)
  ) {
    const resolvedConfig =
      typeof config === "function"
        ? config({ css: this.css.bind(this) })
        : config;
    return this.merge(resolvedConfig);
  }

  public css(path: TokenKey<TConfig>) {
    return this.find(path)?.var;
  }

  public value(path: TokenKey<TConfig>) {
    return this.find(path)?.value;
  }
}
