import { DesignTokenFromPath, DesignTokenPath, DesignTokenValue } from "@types";
import { DesignTokenConfig } from "@classes/DesignTokenConfig";
import { DesignTokens } from "./DesignTokens";
import { DesignTokensConfig } from "./types";

export class DesignTokensTools<
  MediaType extends string = any,
  Config extends DesignTokensConfig = any
> {
  constructor(protected designTokens: DesignTokens<MediaType, Config>) {}

  create<Value extends DesignTokenValue>(
    defaultValue: Value,
    responsiveValues?: never
  ): DesignTokenConfig<{ default: Value }>;
  create<
    Value extends DesignTokenValue,
    ResponsiveValues extends Partial<Record<MediaType, DesignTokenValue>>
  >(
    defaultValue: Value,
    responsiveValues: ResponsiveValues
  ): DesignTokenConfig<{ default: Value } & ResponsiveValues>;
  create<
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

  use<Path extends DesignTokenPath<Config>>(
    path: Path
  ): DesignTokenFromPath<Config, Path>["var"] {
    return this.designTokens.get(path).var;
  }
}
