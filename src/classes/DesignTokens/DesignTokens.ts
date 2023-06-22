import { DesignToken } from "@classes/DesignToken";
import { createThemeUtils } from "@helpers/createThemeUtils";
import {
  DesignTokenPath,
  DesignTokensConfig,
  DesignTokensFormatType,
  ThemeConfig,
  ThemeResolved,
  ThemeUtils,
} from "@types";
import {
  formatDesignTokens,
  createDesignTokens,
  resolveDesignTokens,
} from "@utils";

export class DesignTokens<Theme extends ThemeConfig = ThemeConfig> {
  tokens: DesignToken[];

  constructor(public config: DesignTokensConfig<Theme>) {
    this.tokens = createDesignTokens(config.theme);
  }

  get map() {
    return new Map(this.tokens.map((token) => [token.key, token]));
  }

  get resolved(): ThemeResolved<Theme> {
    return resolveDesignTokens(this);
  }

  get<Path extends DesignTokenPath<Theme>>(path: Path) {
    return this.map.get(path)!;
  }

  format(type: DesignTokensFormatType): string {
    return formatDesignTokens(type, this);
  }

  extend<ExtendedTheme extends ThemeConfig>(
    callback: (utils: ThemeUtils<Theme>) => ExtendedTheme
  ) {
    return new DesignTokens({
      ...this.config,
      theme: {
        ...this.config.theme,
        ...callback(createThemeUtils(this.config.theme)),
      },
    });
  }
}
