import type { Atomic } from "@classes/Atomic";
import { AtomicMode, ThemeConfig } from "@types";

function rule(content: string = "") {
  return `${content}\n`;
}

function cssRule(key: string, value: string | number) {
  return rule(`${key}: ${value};`);
}

function comment(content: string, mode: AtomicMode) {
  switch (mode) {
    case "css":
      return rule(`/* ${content} */`);
    case "sass":
      return rule(`// ${content}`);
  }
}

function wrapInRoot(cssVarsString: string) {
  return [rule(":root {"), cssVarsString, rule("}")].join("");
}

export function formatTokens<Theme extends ThemeConfig>(atomic: Atomic<Theme>) {
  switch (atomic.config.mode) {
    case "css":
      return wrapInRoot(
        Array.from(atomic.groupedTokens)
          .map(([type, tokens]) => {
            const rules = [comment(`${type} variables`, "css")];

            tokens.forEach((token) =>
              rules.push(cssRule(token.varKey, token.value))
            );

            rules.push(rule());

            return rules.join("");
          })
          .join("")
      );
    case "sass":
      return Array.from(atomic.groupedTokens)
        .map(([type, tokens]) => {
          const rules = [comment(`${type} variables`, "sass")];

          tokens.forEach((token) =>
            rules.push(cssRule(token.varKey, token.value))
          );

          rules.push(rule());

          return rules.join("");
        })
        .join("");
    default:
      throw new Error(`No formatting found for type ${atomic.config.mode}`);
  }
}
