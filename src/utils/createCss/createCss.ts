import { Token } from "@classes/Token";
import { batchTokens } from "../batchTokens";

function renderMediaTypePart(children: string[]) {
  const start = ":root {";
  const middle = children;
  const end = "}";

  return [start, ...middle, end];
}

function renderToken(token: Token) {
  return `${token.var}: ${token.value};`;
}

function toCssString(arr: string[][]) {
  return arr.map((item) => item.join("\n")).join("\n");
}

export function createCss<MediaType extends string>(
  tokens: Token<MediaType>[],
  mediaQueries: Record<MediaType, string>
) {
  const [misc, mediaTypeTokens] = batchTokens(
    tokens,
    Object.keys(mediaQueries) as MediaType[]
  );

  const cssArr = [
    ...[misc.length > 0 ? renderMediaTypePart(misc.map(renderToken)) : []],
    ...mediaTypeTokens.map(([mediaType, tokens]) => {
      if (tokens.length === 0) {
        return [];
      }

      const start = `@media ${mediaQueries[mediaType]} {`;
      const middle = tokens.map(renderToken);
      const end = "};";

      return renderMediaTypePart([start, ...middle, end]);
    }),
  ];

  return toCssString(cssArr);
}
