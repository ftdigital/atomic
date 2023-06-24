import type {
  AtomicConfig,
  TokenPath,
  StylesConfig,
  ThemeConfig,
  ThemeUtils,
  ThemeResolved,
  CssFunction,
} from "@types";
import { AtomicStyle } from "@classes/AtomicStyle";
import type { AtomicToken } from "@classes/AtomicToken";
import { createAtomicTokens, formatTokens, groupTokens } from "@utils";
import { createCssFunction } from "@helpers/createCssFunction";

export class Atomic<Theme extends ThemeConfig = ThemeConfig> {
  stylesMap: Map<string, AtomicStyle<Theme>> = new Map();
  tokensMap: Map<string, AtomicToken> = new Map();

  constructor(public config: AtomicConfig<Theme>) {
    this.tokensMap = createAtomicTokens(this);
  }

  get tokens() {
    return Array.from(this.tokensMap.values());
  }

  get utils(): ThemeUtils<Theme> {
    return {
      theme: (path) => this.getToken(path).var,
    };
  }

  get groupedTokens() {
    return groupTokens(this.tokens);
  }

  getToken<Path extends TokenPath<ThemeResolved<Theme>>>(path: Path) {
    return this.tokensMap.get(path)!;
  }

  formatTokens(): string {
    return formatTokens(this);
  }

  merge<ExtendedTheme extends ThemeConfig>(config: ExtendedTheme) {
    return new Atomic({
      ...this.config,
      ...config,
      theme: {
        ...this.config.theme,
      },
    });
  }

  extendTheme<ExtendedTheme extends ThemeConfig>(
    callback: (utils: ThemeUtils<Theme>) => ExtendedTheme
  ) {
    return this.merge(callback(this.utils));
  }

  getStyle(path: string) {
    return this.stylesMap.get(path)!;
  }

  addStyle(callback: ({ css }: { css: CssFunction<Theme> }) => StylesConfig) {
    Object.entries(callback({ css: createCssFunction(this) })).forEach(
      ([name, style]) => {
        const path = [name];
        const atomicStyle = new AtomicStyle(this, path, style);
        this.stylesMap.set(atomicStyle.key, atomicStyle);
      }
    );
  }
}
