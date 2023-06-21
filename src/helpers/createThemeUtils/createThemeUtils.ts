import { GetPathValue, ThemeConfig, ThemeUtils } from "@types";
import { FindByPath } from "@utils";

export function createThemeUtils<Theme extends ThemeConfig>(
  theme: Theme
): ThemeUtils<Theme> {
  return {
    theme: (path) => {
      return FindByPath(path.split("."), theme) as GetPathValue<typeof path>;
    },
  };
}
