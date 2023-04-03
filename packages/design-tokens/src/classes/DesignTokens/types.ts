import type { DesignTokenConfig } from "@classes/DesignTokenConfig";
import type {
  DesignTokenFromPath,
  DesignTokenPath,
  DesignTokenValue,
} from "@types";

export interface DesignTokensOptions<MediaType extends string> {
  mediaQueries: Record<MediaType, string>;
}

export interface ExtendTools<
  MediaType extends string,
  Config extends DesignTokensConfig
> {
  create: <
    Value extends DesignTokenValue,
    ResponsiveValues extends Partial<Record<MediaType, DesignTokenValue>>
  >(
    defaultValue: Value,
    responsiveValues?: ResponsiveValues
  ) => DesignTokenConfig<{ default: Value } & ResponsiveValues>;
  use: <Path extends DesignTokenPath<Config>>(
    path: Path
  ) => DesignTokenFromPath<Config, Path>["var"];
}

export type DesignTokensConfig = {
  [key: string]: DesignTokensConfig | DesignTokenConfig<any>;
};
