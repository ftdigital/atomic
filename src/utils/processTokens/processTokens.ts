import { TokensMap } from "@classes/TokensMap";
import type { AtomicTokensMeta, TokensConfig } from "@types";

function isValue(value: any): value is string | number {
  return typeof value === "number" || typeof value === "string";
}

function isVariantObject(value: any): value is Record<string, string | number> {
  return (
    typeof value === "object" && "default" in value && isValue(value["default"])
  );
}

export function processTokens(
  tokens: TokensConfig,
  meta?: Record<string, AtomicTokensMeta>
): { default: TokensMap } & Record<string, TokensMap> {
  const result: { default: TokensMap } & Record<string, TokensMap> = {
    default: new TokensMap(),
  };

  function loop(obj: TokensConfig, _path: string[] = []) {
    for (const key in obj) {
      const path = [..._path, key];
      const resolvedPath = path.join(".");

      const value = obj[key as keyof typeof obj];

      const resolvedValue = value;

      if (isVariantObject(resolvedValue)) {
        Object.entries(resolvedValue).map(([variant, value]) => {
          if (!(variant in result)) {
            const { description, selector } = meta?.[variant] ?? {};
            result[variant] = new TokensMap(undefined, {
              description,
              selector,
            });
          }
          result[variant]!.set(resolvedPath, value);
        });
      } else if (isValue(resolvedValue)) {
        result.default.set(resolvedPath, resolvedValue);
      } else {
        loop(resolvedValue as TokensConfig, path);
      }
    }
  }

  loop(tokens);

  return result;
}
