import { AtomicTokensMeta } from "@types";

export class TokensMap extends Map<string, string | number> {
  constructor(
    tokens?: Map<string, string | number>,
    public meta: AtomicTokensMeta = {}
  ) {
    super(tokens);
  }

  group() {
    const entries = Array.from(this);

    return entries.reduce((map, token) => {
      const [path] = token;
      const [type] = path.split(".");

      if (!type) return map;

      if (type && !map.has(type)) map.set(type, []);
      map.set(type, [...(map.get(type) ?? []), token]);
      return map;
    }, new Map<string, [string, string | number][]>());
  }
}
