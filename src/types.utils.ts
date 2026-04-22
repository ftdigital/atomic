export type TypeFromPath<
  T extends Record<string, unknown>,
  Path extends string, // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
      ? T[P] extends Record<string, unknown>
        ? TypeFromPath<T[P], S>
        : never
      : never;
}[Path];

type Dot<T extends string, U extends string> = U extends "" ? T : `${T}.${U}`;

type StringKey<K> = K extends string ? K : K extends number ? `${K}` : never;

type DottedPathMap<T, V> = {
  [K in keyof T & (string | number) as StringKey<K>]: StringKey<K> extends "default"
    ? DottedPath<T[K], V>
    : Dot<StringKey<K>, Extract<DottedPath<T[K], V>, string>>;
};

export type DottedPath<T, V> = T extends V
  ? ""
  : DottedPathMap<T, V>[keyof DottedPathMap<T, V>];

export type ResolveDefault<T> = T extends Record<string, unknown>
  ? "default" extends keyof T
    ? T["default"]
    : T
  : T;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
