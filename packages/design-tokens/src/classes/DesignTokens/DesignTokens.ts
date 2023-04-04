import { DesignTokensConfig, DesignTokensOptions } from "./types";
import { createDesignTokens, generateCss } from "@utils";
import { DesignTokenFromPath, DesignTokenPath } from "@types";
import { DesignTokensTools } from "./DesignTokensTools";

export class DesignTokens<
  MediaType extends string = string,
  Config extends DesignTokensConfig = DesignTokensConfig
> {
  private tools: DesignTokensTools<MediaType, Config>;

  private constructor(
    public options: DesignTokensOptions<MediaType>,
    protected config: Config
  ) {
    this.tools = new DesignTokensTools<MediaType, Config>(this);
  }

  public static create<MediaType extends string = string>(
    options: DesignTokensOptions<MediaType>
  ) {
    return new DesignTokens(options, {});
  }

  get mediaTypes() {
    return Object.keys(this.options.mediaQueries) as MediaType[];
  }

  get tokens() {
    return createDesignTokens(this.config);
  }

  get tokensMap() {
    return new Map(
      this.tokens.map(token => [
        token.dottedPath as DesignTokenPath<Config>,
        token
      ])
    );
  }

  private merge<T extends DesignTokensConfig>(tokens: T) {
    return new DesignTokens(this.options, {
      ...this.config,
      ...tokens
    });
  }

  public get<Path extends DesignTokenPath<Config>>(
    path: Path
  ): DesignTokenFromPath<Config, Path> {
    return this.tokensMap.get(path) as DesignTokenFromPath<Config, Path>;
  }

  public generateCss(): string {
    return generateCss(this);
  }

  public extend<T extends DesignTokensConfig>(
    configCallback: (tools: DesignTokensTools<MediaType>) => T
  ) {
    const resolvedConfig = configCallback(this.tools);

    return this.merge(resolvedConfig);
  }
}
