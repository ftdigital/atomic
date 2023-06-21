export type TypeFromPath<
  T extends Record<string, unknown>,
  Path extends string // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends Record<string, unknown>
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];

export type Dot<T extends string, U extends string> = "" extends U
  ? T
  : `${T}.${U}`;
