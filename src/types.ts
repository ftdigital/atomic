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

export type TokenPath<T> = T extends string | number
  ? ""
  : {
      [K in Extract<keyof T, string>]: Dot<K, TokenPath<T[K]>>;
    }[Extract<keyof T, string>];

type ThemeFunction<Theme extends ThemeConfig> = <
  Path extends TokenPath<ThemeResolved<Theme>>
>(
  path: Path
) => string;

export interface ThemeUtils<Theme extends ThemeConfig = any> {
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

export type ThemeConfigValueMap = {
  [Type in keyof ThemeConfigMap]: InferKeyValueValue<ThemeConfigMap[Type]>;
};

export type ThemeConfig = {
  [Type in keyof ThemeConfigMap]?: ResolvableTo<ThemeConfigMap[Type]>;
};

export type AtomicMode = "css" | "sass";

export type StylesConfig<Theme extends ThemeConfig = ThemeConfig> = {
  [key: string]: Interpolation<Theme>[] | StylesConfig<Theme>;
};

export interface AtomicConfig<Theme extends ThemeConfig> {
  mode: AtomicMode;
  exports?: {
    vars?: string;
    styles?: string;
  };
  theme: Theme;
  styles?: StylesConfig<Theme>;
}

export type ThemeResolved<Theme extends ThemeConfig> = {
  [Type in keyof Theme]: InferResolvableTo<Theme[Type]>;
};

export interface ThemeUtilsFunction<Theme extends ThemeConfig> {
  (utils: ThemeUtils<Theme>): Interpolation<Theme>;
}

export type Interpolation<Theme extends ThemeConfig = ThemeConfig> =
  | ThemeUtilsFunction<Theme>
  | TemplateStringsArray
  | string
  | number
  | false
  | undefined
  | null
  | Interpolation<Theme>[];

export type CssFunction<Theme extends ThemeConfig = ThemeConfig> = (
  ...interpolation: Interpolation<Theme>[]
) => Interpolation<Theme>[];
