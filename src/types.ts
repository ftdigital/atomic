import { AtomicTokens } from "@classes/AtomicTokens";
import type { Dot } from "./types.utils";

type KeyValuePair<Value extends string | number = string | number> = Record<
  string,
  Value
>;

interface RecursiveKeyValuePair<
  Value extends string | number = string | number,
> {
  [key: string]: Value | RecursiveKeyValuePair<Value>;
}

interface TokensConfigMap {
  screens: KeyValuePair;
  mediaQueries: KeyValuePair<string>;

  spacing: KeyValuePair;
  colors: RecursiveKeyValuePair<string>;
  zIndex: KeyValuePair;

  transitionDuration: KeyValuePair<string>;
  transition: KeyValuePair<string>;

  fontFamily: KeyValuePair<string>;
  fontSize: KeyValuePair;
  fontWeight: KeyValuePair<string>;
  font: KeyValuePair<string>;

  borderRadius: KeyValuePair;
  boxShadow: KeyValuePair;
  blur: KeyValuePair;
}

export type TokenPath<T> = T extends string | number
  ? ""
  : {
      [K in Extract<keyof T, string>]: Dot<K, TokenPath<T[K]>>;
    }[Extract<keyof T, string>];

export interface TokenUtils<TConfig extends TokensConfig> {
  token: (path: TokenPath<TokensConfigResolved<TConfig>>) => string;
}

type ResolvableTo<T> = T | ((utils: TokenUtils<TokensConfig>) => T);

type InferResolvableTo<T> = T extends ResolvableTo<infer A> ? A : never;

export type TokensConfig = {
  [Type in keyof TokensConfigMap]?: ResolvableTo<TokensConfigMap[Type]>;
};

type TokensConfigResolved<TConfig extends TokensConfig> = {
  [Type in keyof TConfig]: InferResolvableTo<TConfig[Type]>;
};

export type AtomicMode = "css" | "scss" | "sass";

export interface AtomicConfig<TConfig extends TokensConfig> {
  tokens: TConfig;
  mode: AtomicMode;
  target: string;
  variants?: {
    selector: string;
    tokens: Partial<TConfig>;
    description?: string;
  }[];
}

export interface AtomicTokensMeta {
  description?: string;
  selector?: string;
}

export interface Atomic<TConfig extends TokensConfig> {
  config: AtomicConfig<TConfig>;
  format: () => string;
  var: (path: TokenPath<TokensConfigResolved<TConfig>>) => string;
}
