import type { DesignTokenConfig } from "@classes/DesignTokenConfig";

export interface DesignTokensOptions<MediaType extends string> {
  mediaQueries: Record<MediaType, string>;
}

export type DesignTokensConfig = {
  [key: string]: DesignTokensConfig | DesignTokenConfig;
};
