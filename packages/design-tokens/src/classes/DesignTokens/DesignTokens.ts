import { DesignTokensConfig, DesignTokensOptions, ExtendTools } from "./types";
import { createDesignTokens } from "@utils";
import { DesignTokenFromPath, DesignTokenPath } from "@types";
import { DesignTokenConfig } from "@classes/DesignTokenConfig";

export class DesignTokens<
  MediaType extends string = string,
  Config extends DesignTokensConfig = DesignTokensConfig
> {
  public options: DesignTokensOptions<MediaType>;
  private config: Config;

  private constructor(options: DesignTokensOptions<MediaType>, config: Config) {
    this.options = options;
    this.config = config;
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
    return this.generateCss(this);
  }

  public extend<T extends DesignTokensConfig>(
    configCallback: (tools: ExtendTools<MediaType, Config>) => T
  ) {
    const get = this.get.bind(this);

    const extendTools = {
      create: function create(defaultValue, responsiveValues) {
        return new DesignTokenConfig({
          default: defaultValue,
          ...responsiveValues
        });
      },
      use: path => get(path).var
    } as ExtendTools<MediaType, Config>;

    const resolvedConfig = configCallback(extendTools);

    return this.merge(resolvedConfig);
  }
}
