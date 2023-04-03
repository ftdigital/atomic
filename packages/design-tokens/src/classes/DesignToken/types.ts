import type { DesignTokenConfig } from "@classes/DesignTokenConfig";

export type InferDesignTokenConfigValue<
  T extends DesignTokenConfig<any>,
  MediaType extends string | undefined = undefined
> = T extends DesignTokenConfig<infer Values>
  ? MediaType extends string
    ? Values[MediaType]
    : Values["default"]
  : never;

export type InferDesignTokenConfigMediaType<T extends DesignTokenConfig<any>> =
  T extends DesignTokenConfig<infer ResponsiveValues>
    ? keyof Omit<ResponsiveValues, "default"> extends string
      ? keyof Omit<ResponsiveValues, "default">
      : never
    : never;
