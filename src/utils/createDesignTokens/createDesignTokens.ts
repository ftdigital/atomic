import { DesignToken } from "@classes/DesignToken";
import { createThemeUtils } from "@helpers/createThemeUtils";
import { ThemeConfig } from "@types";

export function createDesignTokens<Theme extends ThemeConfig>(theme: Theme) {
  const tokens: DesignToken[] = [];

  function loop(obj: ThemeConfig, _path: string[] = []) {
    for (const key in obj) {
      let result = obj[key as keyof ThemeConfig];

      const resolvedResult =
        typeof result === "function" ? result(createThemeUtils(theme)) : result;

      const path = [..._path, key];

      if (
        typeof resolvedResult === "number" ||
        typeof resolvedResult === "string"
      ) {
        const token = new DesignToken(path, resolvedResult);
        tokens.push(token);
      } else {
        loop(resolvedResult as ThemeConfig, path);
      }
    }
  }

  loop(theme);

  return tokens;
}
