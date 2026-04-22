import { DeepPartial, DottedPath, ResolveDefault, TypeFromPath } from "./types.utils";

type TokenValue = string | number;

type TokenPath<T extends Record<string, unknown>> = Extract<
  DottedPath<T, TokenValue>,
  string
>;

interface RecursiveKeyValuePair {
  [key: string]: TokenValue | RecursiveKeyValuePair;
}

export type TokensConfig = {
  [key: string]: TokenValue | RecursiveKeyValuePair;
};

export type AtomicVarType = "css" | "scss" | "sass";

export interface VariantConfig<TConfig extends TokensConfig> {
  selector: string;
  description?: string;
  tokens: DeepPartial<TConfig>;
}
export interface AtomicConfig<
  TConfig extends TokensConfig,
  TVariants extends Record<string, VariantConfig<TConfig>> = Record<
    string,
    VariantConfig<TConfig>
  >,
> {
  tokens: TConfig;
  variants?: TVariants;
  varType?: AtomicVarType;
  filePath?: string;
}

export interface AtomicTokensMeta {
  description?: string;
  selector?: string;
}

export interface TokenSet {
  entries: Map<string, TokenValue>;
  meta: AtomicTokensMeta;
}

export interface Atomic<
  TConfig extends TokensConfig,
  TVariants extends Record<string, VariantConfig<TConfig>> = Record<
    string,
    VariantConfig<TConfig>
  >,
> {
  config: AtomicConfig<TConfig, TVariants>;
  format: () => string;
  ref: (path: TokenPath<TConfig>) => string;
  value: <TPath extends TokenPath<TConfig>>(
    path: TPath,
    variant?: keyof TVariants,
  ) => ResolveDefault<TypeFromPath<TConfig, TPath>> | undefined;
  write: () => void;
  extend: <TExtra extends TokensConfig>(
    factory:
      | TExtra
      | ((utils: { ref: (path: TokenPath<TConfig>) => string }) => TExtra),
    overrides?: Pick<AtomicConfig<TConfig & TExtra>, "varType" | "filePath">,
  ) => Atomic<TConfig & TExtra>;
}
