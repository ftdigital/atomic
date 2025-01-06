import { DeepPartial, DottedPath } from "./types.utils";

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

export type TokensConfig = {
  [K in keyof TokensObject]?: WithTokenUtils<TokensObject[K]>;
};

export interface TokenUtils {
  get: (path: string) => string;
}

type WithTokenUtils<T> =
  | T
  | ((utils: TokenUtils) => T)
  | { [K in keyof T]: WithTokenUtils<T[K]> };

type InferResolvableTo<T> = T extends {
  default: infer A;
}
  ? A
  : T extends (utils: any) => infer A
    ? A
    : { [K in keyof T]: InferResolvableTo<T[K]> };

export type ResolvedTokensConfig<TConfig extends TokensConfig> =
  InferResolvableTo<TConfig>;

export type AtomicMode = "css" | "scss" | "sass";

export interface VariantConfig<TConfig extends TokensConfig> {
  selector: string;
  description?: string;
  tokens: DeepPartial<TConfig>;
}
export interface AtomicConfig<TConfig extends TokensConfig> {
  tokens: TConfig;
  variants?: Record<string, VariantConfig<TConfig>>;
  mode: AtomicMode;
  target: string;
}

export interface AtomicTokensMeta {
  description?: string;
  selector?: string;
}

export interface Atomic<TConfig extends TokensConfig> {
  config: AtomicConfig<TConfig>;
  format: () => string;
  get: (path: TokenPath<ResolvedTokensConfig<TConfig>>) => string;
  addVariant: (name: string, config: VariantConfig<TConfig>) => Atomic<TConfig>;
}
