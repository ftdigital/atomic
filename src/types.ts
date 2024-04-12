import { DottedPath } from "types.utils";

type TokenPath<T extends Record<string, unknown>> = DottedPath<
  T,
  string | number
>;

type KeyValuePair<Value extends string | number> = Record<string, Value>;

interface RecursiveKeyValuePair<Value extends string | number> {
  [key: string]: Value | RecursiveKeyValuePair<Value>;
}
interface TokensObject {
  screens: KeyValuePair<string | number>;
  mediaQueries: KeyValuePair<string>;

  spacing: KeyValuePair<string | number>;
  colors: RecursiveKeyValuePair<string>;
  zIndex: KeyValuePair<string | number>;

  transitionDuration: KeyValuePair<string>;
  transition: KeyValuePair<string>;

  fontFamily: KeyValuePair<string>;
  fontSize: KeyValuePair<string | number>;
  fontWeight: KeyValuePair<string>;
  font: KeyValuePair<string>;

  borderRadius: KeyValuePair<string | number>;
  boxShadow: KeyValuePair<string | number>;
  blur: KeyValuePair<string | number>;
}

export type TokensConfig<Variant extends string> = {
  [K in keyof TokensObject]?: WithTokenUtils<
    WithVariants<TokensObject[K], Variant>
  >;
};

type WithVariants<T, Variant extends string> = T extends string | number
  ? T | ({ default: T } & Partial<Record<Variant, T>>)
  : { [K in keyof T]: WithVariants<T[K], Variant> };

export interface TokenUtils {
  get: (path: string) => string;
}

type WithTokenUtils<T> =
  | T
  | ((utils: TokenUtils) => T)
  | { [K in keyof T]: WithTokenUtils<T[K]> };

type InferResolvableTo<T, Variants extends string> = T extends {
  default: infer A;
}
  ? A
  : T extends (utils: any) => infer A
    ? A
    : { [K in keyof T]: InferResolvableTo<T[K], Variants> };

export type ResolvedTokensConfig<
  Variant extends string,
  TConfig extends TokensConfig<Variant>,
> = InferResolvableTo<TConfig, Variant>;

export type AtomicMode = "css" | "scss" | "sass";

export interface VariantConfig {
  selector: string;
  description?: string;
}
export interface AtomicConfig<
  Variant extends string,
  TConfig extends TokensConfig<Variant>,
> {
  tokens: TConfig;
  mode: AtomicMode;
  target: string;
  variants?: Record<Variant, VariantConfig>;
}

export interface AtomicTokensMeta {
  description?: string;
  selector?: string;
}

export interface Atomic<
  Variant extends string,
  TConfig extends TokensConfig<Variant>,
> {
  config: AtomicConfig<Variant, TConfig>;
  format: () => string;
  get: (path: TokenPath<ResolvedTokensConfig<Variant, TConfig>>) => string;
}
