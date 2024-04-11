export function groupTokens(tokens: [string, string | number][]) {
  return tokens.reduce((map, token) => {
    const [path] = token;
    const [type] = path.split(".");

    if (!type) return map;

    if (type && !map.has(type)) map.set(type, []);
    map.set(type, [...(map.get(type) ?? []), token]);
    return map;
  }, new Map<string, [string, string | number][]>());
}
