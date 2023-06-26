import type {
  AtomicConfig,
  TokenPath,
  StylesConfig,
  ThemeConfig,
  ThemeUtils,
  ThemeResolved,
} from "@types";
import { AtomicStyle } from "@classes/AtomicStyle";
import type { AtomicToken } from "@classes/AtomicToken";
import { createAtomicTokens, formatTokens, groupTokens } from "@utils";
import { createAtomicStyles } from "utils/createAtomicStyles";

export class Atomic<Theme extends ThemeConfig = ThemeConfig> {
  stylesMap: Map<string, AtomicStyle<Theme>> = new Map();
  tokensMap: Map<string, AtomicToken> = new Map();

  constructor(public config: AtomicConfig<Theme>) {
    this.tokensMap = createAtomicTokens(this, config.theme);
    this.stylesMap = createAtomicStyles(this, config.styles ?? {});
  }

  get tokens() {
    return Array.from(this.tokensMap.values());
  }

  get utils(): ThemeUtils<Theme> {
    return {
      theme: (path) => this.token(path).var,
    };
  }

  get groupedTokens() {
    return groupTokens(this.tokens);
  }

  token<Path extends TokenPath<ThemeResolved<Theme>>>(path: Path) {
    return this.tokensMap.get(path)!;
  }

  formatTokens(): string {
    return formatTokens(this);
  }

  style(path: string) {
    return this.stylesMap.get(path)!;
  }

  merge<ExtendedTheme extends ThemeConfig>(
    config: AtomicConfig<ExtendedTheme>
  ) {
    return new Atomic({
      ...this.config,
      ...config,
    });
  }

  extendTheme<ExtendedTheme extends ThemeConfig>(
    callback: (utils: ThemeUtils<Theme>) => ExtendedTheme
  ) {
    return this.merge({
      ...this.config,
      theme: {
        ...this.config.theme,
        ...callback(this.utils),
      },
    });
  }

  getStyle(path: string) {
    return this.stylesMap.get(path)!;
  }

  addStyles(stylesConfig: StylesConfig<Theme>) {
    this.stylesMap = createAtomicStyles(this, stylesConfig);
  }
}