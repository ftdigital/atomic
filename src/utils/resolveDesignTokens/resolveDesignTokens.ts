import { DesignTokens } from "@classes/DesignTokens";
import { ThemeConfig, ThemeResolved } from "@types";

export function resolveDesignTokens<Theme extends ThemeConfig>(
  designTokens: DesignTokens<Theme>
): ThemeResolved<Theme> {
  let dir: Record<string, unknown> = {};

  for (let index = 0; index < designTokens.tokens.length; index++) {
    const token = designTokens.tokens[index];

    token?.path.reduce((dir, key, index) => {
      const isLastKey = index === token.path.length - 1;

      const result = isLastKey ? token.value : dir[key] ?? {};

      return (dir[key] = result as Record<string, unknown>);
    }, dir);
  }

  return dir as ThemeResolved<Theme>;
}
