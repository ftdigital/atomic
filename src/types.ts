export type TokenValue = string | number;

export type TokensConfig<MediaType extends string = string> = {
  [key: string]:
    | TokensConfig<MediaType>
    | TokenValue
    | undefined
    | Record<MediaType, TokenValue>;
};

export interface TokensOptions<MediaType extends string> {
  mediaQueries: Record<MediaType, string>;
}

type PathsToStringProps<T> = T extends TokenValue
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T, D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends TokenValue
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : TokenValue;

export type TokenKey<T extends Record<string, unknown>> = Join<
  PathsToStringProps<T>,
  "."
>;
