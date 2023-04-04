import type { DesignTokenConfig } from "@classes/DesignTokenConfig";

export type InferDesignTokenConfigValue<
  T extends DesignTokenConfig<any>,
  MediaType extends string | void = undefined
> = T extends DesignTokenConfig<infer Values>
  ? MediaType extends keyof Values
    ? Values[MediaType]
    : Values["default"]
  : never;

export type InferDesignTokenConfigMediaType<T extends DesignTokenConfig<any>> =
  T extends DesignTokenConfig<infer Values>
    ? keyof Omit<Values, "default"> extends string
      ? keyof Omit<Values, "default">
      : never
    : never;
