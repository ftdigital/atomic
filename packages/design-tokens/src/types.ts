import type { DesignToken } from "@classes/DesignToken";
import type { DesignTokenConfig } from "@classes/DesignTokenConfig";
import type { DesignTokensConfig } from "@classes/DesignTokens";

export type DesignTokenValue = string | number;

type TypeFromPath<
  T extends Record<string, unknown>,
  Path extends string // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends Record<string, unknown>
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];

type Dot<T extends string, U extends string> = "" extends U ? T : `${T}.${U}`;

export type DesignTokenPath<T> = T extends DesignTokenConfig<any>
  ? ""
  : {
      [K in Extract<keyof T, string>]: Dot<K, DesignTokenPath<T[K]>>;
    }[Extract<keyof T, string>];

export type DesignTokenConfigFromPath<
  Config extends DesignTokensConfig,
  Path extends string
> = TypeFromPath<Config, Path> extends DesignTokenConfig<infer Values>
  ? DesignTokenConfig<Values>
  : never;

export type DesignTokenFromPath<
  Config extends DesignTokensConfig,
  Path extends string
> = TypeFromPath<Config, Path> extends DesignTokenConfig<infer Values>
  ? DesignToken<DesignTokenConfig<Values>>
  : never;
