import type { DesignTokens } from "@classes/DesignTokens";
import { DesignTokensFormatType, ThemeConfig } from "@types";

function rule(content: string) {
  return `${content}\n`;
}

function cssRule(key: string, value: string | number) {
  return rule(`  ${key}: ${value};`);
}

function wrapInRoot(cssVarsString: string) {
  return [rule(":root {"), cssVarsString, rule("}")].join("");
}

export function formatDesignTokens<Theme extends ThemeConfig>(
  type: DesignTokensFormatType,
  { map, resolved }: DesignTokens<Theme>
) {
  switch (type) {
    case "css":
      return wrapInRoot(
        Array.from(map.values())
          .map((token) => {
            const { key } = token.format("css");
            return cssRule(key, token.value);
          })
          .join("")
      );
    case "sass":
      return Array.from(map.values())
        .map((token) => {
          const { key } = token.format("sass");
          return cssRule(key, token.value);
        })
        .join("");

    case "js":
      return "export default " + JSON.stringify(resolved);
    case "ts":
      return "export default " + JSON.stringify(resolved) + " as const;";
    default:
      throw new Error(`No formatting found for type ${type}`);
  }
}
