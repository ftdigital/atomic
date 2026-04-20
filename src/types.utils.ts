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

type Dot<T extends string, U extends string> = "" extends U ? T : `${T}.${U}`;

type StringKey<K> = K extends string ? K : K extends number ? `${K}` : never;

export type DottedPath<T, V> = T extends V
  ? ""
  : {
      [K in keyof T as StringKey<K>]: StringKey<K> extends "default"
        ? DottedPath<T[K], V>
        : Dot<StringKey<K>, DottedPath<T[K], V>>;
    }[StringKey<keyof T>];

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
