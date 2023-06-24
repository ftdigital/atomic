import type { AtomicToken } from "@classes/AtomicToken";

export function groupTokens(tokens: AtomicToken[]) {
  return tokens.reduce((map, token) => {
    if (!map.has(token.type)) map.set(token.type, []);
    map.set(token.type, [...(map.get(token.type) ?? []), token]);
    return map;
  }, new Map<string, AtomicToken[]>());
}
