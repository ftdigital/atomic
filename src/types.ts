import type { Dot } from "./types.utils";

export type TokenPath<T> = T extends string | number
  ? ""
  : {
      [K in Extract<keyof T, string>]: Dot<K, TokenPath<T[K]>>;
    }[Extract<keyof T, string>];

type KeyValuePair<Value extends string | number> = Record<string, Value>;

interface RecursiveKeyValuePair<Value extends string | number> {
  [key: string]: Value | RecursiveKeyValuePair<Value>;
}
export interface TokensConfigMap {
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

type WithVariants<Variants extends string, T> = T extends string | number
  ? T | ({ default: T } & Partial<Record<Variants, T>>)
  : {
      [K in Extract<keyof T, string>]: WithVariants<Variants, T[K]>;
    };

export type TokensConfig<Variants extends string = string> = {
  [Type in keyof TokensConfigMap]?: WithVariants<
    Variants,
    TokensConfigMap[Type]
  >;
};

type InferResolvableTo<Variants extends string, T> =
  T extends WithVariants<Variants, infer A> ? A : never;

export type TokensConfigResolved<
  Variants extends string,
  TConfig extends TokensConfig,
> = {
  [Type in keyof TConfig]: InferResolvableTo<Variants, TConfig[Type]>;
};

export type AtomicMode = "css" | "scss" | "sass";

export interface AtomicConfig<
  Variants extends string,
  TConfig extends TokensConfig<Variants>,
> {
  tokens: TConfig;
  mode: AtomicMode;
  target: string;
  variants?: Record<
    Variants,
    {
      selector: string;
      description?: string;
    }
  >;
}

export interface AtomicTokensMeta {
  description?: string;
  selector?: string;
}

export interface Atomic<
  Variants extends string = never,
  TConfig extends TokensConfig<Variants> = TokensConfig<Variants>,
> {
  config: AtomicConfig<Variants, TConfig>;
  format: () => string;
  var: (path: TokenPath<TokensConfigResolved<Variants, TConfig>>) => string;
}
