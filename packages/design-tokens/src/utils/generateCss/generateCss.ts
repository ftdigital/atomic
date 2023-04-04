import type { DesignTokens } from "@classes/DesignTokens";

function rule(content: string) {
  return `${content}\n`;
}

function cssVarRule(key: string, value: string | number) {
  return rule(`${key}: ${value};`);
}

function mediaQueryCss(cssVars: string[], mediaQuery?: string) {
  const content = cssVars.join("");

  return mediaQuery
    ? [rule(`@media(${mediaQuery}) {`), content, rule("}")].join("")
    : content;
}

export function generateCss({
  mediaTypes,
  tokens,
  options
}: DesignTokens<any, any>) {
  const cssVars = Object.fromEntries(
    ["default", ...mediaTypes].map(mediaType => [mediaType, []])
  ) as Record<string, string[]>;

  tokens.forEach(token => {
    ["default", ...token.mediaTypes].map(mediaType => {
      cssVars[mediaType]?.push(
        cssVarRule(
          token.key,

          token.value(mediaType === "default" ? undefined : mediaType)
        )
      );
    });
  });

  return Object.entries(cssVars)
    .filter(([_, cssVarRules]) => cssVarRules.length > 0)
    .map(([mediaType, cssVarRules]) => {
      const mediaQuery =
        mediaType !== "default" ? options.mediaQueries[mediaType] : undefined;

      return mediaQueryCss(cssVarRules, mediaQuery);
    })
    .join("");
}
