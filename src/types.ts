import { Dot } from "types.utils";

type KeyValuePair<
  Value extends string | number = string | number,
  Key extends string = string
> = Record<Key, Value>;

interface RecursiveKeyValuePair<
  Value extends string | number = string | number
> {
  [key: string]: Value | RecursiveKeyValuePair<Value>;
}

export type DesignTokenPath<T> = T extends string | number
  ? ""
  : {
      [K in Extract<keyof T, string>]: Dot<K, DesignTokenPath<T[K]>>;
    }[Extract<keyof T, string>];

type ThemeFunction<Theme extends ThemeConfig | undefined = undefined> = <
  Path extends Theme extends ThemeConfig
    ? DesignTokenPath<ThemeResolved<Theme>>
    : string
>(
  path: Path
) => GetPathValue<Path>;

export type GetPathValue<Path extends string> =
  Path extends `${infer Type}.${string}`
    ? Type extends keyof ThemeConfigValueMap
      ? ThemeConfigValueMap[Type]
      : string | number
    : string | number;

export interface ThemeUtils<Theme extends ThemeConfig | undefined = undefined> {
  theme: ThemeFunction<Theme>;
}

type ResolvableTo<T> = T | ((utils: ThemeUtils) => T);

type InferResolvableTo<T> = T extends ResolvableTo<infer A> ? A : never;

type InferKeyValueValue<T extends KeyValuePair | RecursiveKeyValuePair> =
  T extends KeyValuePair<infer Value>
    ? Value
    : T extends RecursiveKeyValuePair<infer Value>
    ? Value
    : never;

interface ThemeConfigMap {
  screens: KeyValuePair;
  spacing: KeyValuePair;
  fontSize: KeyValuePair;
  colors: RecursiveKeyValuePair<string>;
}

type ThemeConfigValueMap = {
  [Type in keyof ThemeConfigMap]: InferKeyValueValue<ThemeConfigMap[Type]>;
};

export type ThemeConfig = {
  [Type in keyof ThemeConfigMap]?: ResolvableTo<ThemeConfigMap[Type]>;
};

export type DesignTokensFormatType = "css" | "sass" | "js" | "ts";

type DesignTokensExports = Record<DesignTokensFormatType, string>;

export interface DesignTokensConfig<Theme extends ThemeConfig> {
  exports?: Partial<DesignTokensExports>;
  theme: Theme;
}

export type ThemeResolved<Theme extends ThemeConfig> = {
  [Type in keyof Theme]: InferResolvableTo<Theme[Type]>;
};
