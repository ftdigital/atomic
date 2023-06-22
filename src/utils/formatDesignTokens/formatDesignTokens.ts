import type { DesignTokens } from "@classes/DesignTokens";
import { DesignTokensFormatType, ThemeConfig } from "@types";

function rule(content: string = "") {
  return `${content}\n`;
}

function cssRule(key: string, value: string | number) {
  return rule(`  ${key}: ${value};`);
}

function comment(content: string) {
  return rule(`//  ${content}`);
}

function wrapInRoot(cssVarsString: string) {
  return [rule(":root {"), cssVarsString, rule("}")].join("");
}

export function formatDesignTokens<Theme extends ThemeConfig>(
  type: DesignTokensFormatType,
  { grouped }: DesignTokens<Theme>
) {
  switch (type) {
    case "css":
      return wrapInRoot(
        Array.from(grouped)
          .map(([type, tokens]) => {
            const rules = [comment(`${type} variables`)];

            tokens.forEach((token) => {
              const { key } = token.format("css");
              return rules.push(cssRule(key, token.value));
            });

            rules.push(rule());

            return rules.join("");
          })
          .join("")
      );
    case "sass":
      return Array.from(grouped)
        .map(([type, tokens]) => {
          const rules = [comment(`${type} variables`)];

          tokens.forEach((token) => {
            const { key } = token.format("sass");
            return rules.push(cssRule(key, token.value));
          });

          rules.push(rule());

          return rules.join("");
        })
        .join("");
    default:
      throw new Error(`No formatting found for type ${type}`);
  }
}
