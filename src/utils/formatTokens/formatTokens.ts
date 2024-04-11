import { TokensMap } from "@classes/TokensMap";
import { AtomicMode } from "@types";
import { formatTokenVar } from "@utils";

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
    case "scss":
      return rule(`// ${content}`);
  }
}

function wrapInSelector(selector: string, cssVarsString: string) {
  return [rule(`${selector} {`), cssVarsString, rule("}")].join("");
}

function wrapInRoot(cssVarsString: string) {
  return wrapInSelector(":root", cssVarsString);
}

function formatAtomicTokens(tokens: TokensMap, mode: AtomicMode) {
  const groupedTokens = tokens.group();

  switch (mode) {
    case "css": {
      const contents = Array.from(groupedTokens)
        .map(([type, tokens]) => {
          const rules = [comment(`${type} variables`, mode)];

          tokens.forEach(([path, value]) =>
            rules.push(cssRule(formatTokenVar(path, mode).key, value))
          );

          rules.push(rule());

          return rules.join("");
        })
        .join("");

      if (tokens.meta.selector) {
        return wrapInSelector(tokens.meta.selector, contents);
      }

      return contents;
    }
    case "sass":
    case "scss": {
      const contents = Array.from(groupedTokens)
        .map(([type, tokens]) => {
          const rules = [comment(`${type} variables`, mode)];

          tokens.forEach(([path, value]) =>
            rules.push(cssRule(formatTokenVar(path, mode).key, value))
          );

          rules.push(rule());

          return rules.join("");
        })
        .join("");

      if (tokens.meta.selector) {
        return wrapInSelector(tokens.meta.selector, contents);
      }

      return contents;
    }
    default:
      throw new Error(`No formatting found for type ${mode}`);
  }
}

export function formatTokens(tokensArray: TokensMap[], mode: AtomicMode) {
  const contents = tokensArray
    .map((tokens) => formatAtomicTokens(tokens, mode))
    .join("");

  switch (mode) {
    case "css": {
      return wrapInRoot(contents);
    }
    case "sass":
    case "scss": {
      return contents;
    }
    default:
      throw new Error(`No formatting found for type ${mode}`);
  }
}
