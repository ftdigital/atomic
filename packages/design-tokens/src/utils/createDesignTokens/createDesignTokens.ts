import { DesignToken } from "@classes/DesignToken";
import { DesignTokenConfig } from "@classes/DesignTokenConfig";
import type { DesignTokensConfig } from "@classes/DesignTokens";

export function createDesignTokens(designTokensConfig: DesignTokensConfig) {
  const designTokens: DesignToken<any>[] = [];

  function loop(obj: DesignTokensConfig, _path: string[] = []) {
    for (const key in obj) {
      const result = obj[key]!;

      const path = [..._path, key];

      if (result instanceof DesignTokenConfig) {
        designTokens.push(new DesignToken(path, result));
      } else {
        loop(result as DesignTokensConfig, path);
      }
    }
  }

  loop(designTokensConfig);

  return designTokens;
}
