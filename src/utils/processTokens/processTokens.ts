import { TokensMap } from "@classes/TokensMap";
import type { AtomicTokensMeta, TokenUtils, TokensConfig } from "@types";

function isValue(value: any): value is string | number {
  return typeof value === "number" || typeof value === "string";
}

function isVariantObject(
  value: any
): value is Record<
  string,
  string | number | ((utils: TokenUtils) => string | number)
> {
  return (
    typeof value === "object" && "default" in value && isValue(value["default"])
  );
}

export function processTokens(
  tokens: Record<"default" | string, TokensMap>,
  tokensConfig: TokensConfig<any>,
  variants: Record<string, AtomicTokensMeta>,
  utils: TokenUtils
): void {
  function loop(obj: Record<string, unknown>, _path: string[] = []) {
    for (const key in obj) {
      const path = [..._path, key];
      const resolvedPath = path.join(".");

      const value = obj[key as keyof typeof obj];

      const resolvedValue = typeof value === "function" ? value(utils) : value;

      if (isVariantObject(resolvedValue)) {
        Object.entries(resolvedValue).map(([variant, value]) => {
          if (!(variant in tokens)) {
            const { description, selector } = variants?.[variant] ?? {};
            tokens[variant] = new TokensMap(undefined, {
              description,
              selector,
            });
          }
          tokens[variant]!.set(
            resolvedPath,
            typeof value === "function" ? value(utils) : value
          );
        });
      } else if (isValue(resolvedValue)) {
        tokens?.["default"]?.set(resolvedPath, resolvedValue);
      } else {
        loop(resolvedValue, path);
      }
    }
  }

  loop(tokensConfig as Record<string, unknown>);
}
