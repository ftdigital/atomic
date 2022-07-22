export type TokensConfig<MediaType extends string = string> = {
  [key: string]:
    | TokensConfig<MediaType>
    | string
    | number
    | Record<MediaType, string | number>;
};

export type TokenVars<T, MediaType extends string> = T extends object
  ? keyof T extends MediaType
    ? TokenVars<T[keyof T], MediaType>
    : {
        [P in keyof T]: TokenVars<T[P], MediaType>;
      }
  : string;
