import { DeepPartial, DottedPath } from "./types.utils";

type TokenPath<T extends Record<string, unknown>> = Extract<
  DottedPath<T, string | number>,
  string
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
  [K in keyof TokensObject]?: TokensObject[K];
};


export type AtomicMode = "css" | "scss" | "sass";

export interface VariantConfig<TConfig extends TokensConfig> {
  selector: string;
  description?: string;
  tokens: DeepPartial<TConfig>;
}
export interface AtomicConfig<
  TConfig extends TokensConfig,
  TVariants extends Record<string, VariantConfig<TConfig>> = Record<string, VariantConfig<TConfig>>
> {
  tokens: TConfig;
  variants?: TVariants;
  mode: AtomicMode;
  target: string;
}

export interface AtomicTokensMeta {
  description?: string;
  selector?: string;
}

export interface TokenSet {
  entries: Map<string, string | number>;
  meta: AtomicTokensMeta;
}

export interface Atomic<
  TConfig extends TokensConfig,
  TVariants extends Record<string, VariantConfig<TConfig>> = Record<string, VariantConfig<TConfig>>
> {
  config: AtomicConfig<TConfig, TVariants>
  format: () => string
  ref: (path: TokenPath<TConfig>) => string
  value: (path: TokenPath<TConfig>, variant?: keyof TVariants) => string | number | undefined
  write: () => void
  extend: <TExtra extends TokensConfig>(
    factory:
      | TExtra
      | ((utils: { ref: (path: TokenPath<TConfig>) => string }) => TExtra)
  ) => Atomic<TConfig & TExtra>
}
