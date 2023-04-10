import { DesignTokensConfig, DesignTokensOptions } from "./types";
import { createDesignTokens, generateCss } from "@utils";
import { DesignTokenFromPath, DesignTokenPath, DesignTokenValue } from "@types";
import { DesignTokenConfig } from "@classes/DesignTokenConfig";

export class DesignTokens<
  MediaType extends string = string,
  Config extends DesignTokensConfig = DesignTokensConfig
> {
  private constructor(
    public options: DesignTokensOptions<MediaType>,
    protected config: Config
  ) {}

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

  get tools() {
    const get = this.get.bind(this);

    function create<Value extends DesignTokenValue>(
      defaultValue: Value,
      responsiveValues?: never
    ): DesignTokenConfig<{ default: Value }>;
    function create<
      Value extends DesignTokenValue,
      ResponsiveValues extends Partial<Record<MediaType, DesignTokenValue>>
    >(
      defaultValue: Value,
      responsiveValues: ResponsiveValues
    ): DesignTokenConfig<{ default: Value } & ResponsiveValues>;
    function create<
      Value extends DesignTokenValue,
      ResponsiveValues extends
        | Partial<Record<MediaType, DesignTokenValue>>
        | undefined
    >(
      defaultValue: Value,
      responsiveValues: ResponsiveValues
    ): DesignTokenConfig<{ default: Value } & ResponsiveValues> {
      return new DesignTokenConfig({
        default: defaultValue,
        ...responsiveValues
      });
    }

    function use<Path extends DesignTokenPath<Config>>(
      path: Path
    ): DesignTokenFromPath<Config, Path>["var"] {
      return get(path)["var"];
    }

    return {
      create,
      use: use.bind(this)
    };
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
    configCallback: (tools: DesignTokens<MediaType, Config>["tools"]) => T
  ) {
    const resolvedConfig = configCallback(this.tools);

    return this.merge(resolvedConfig);
  }
}
