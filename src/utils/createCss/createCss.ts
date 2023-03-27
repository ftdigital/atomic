import { Token } from "@classes/Token";
import { Tokens } from "@classes/Tokens";

function batchTokens<MediaType extends string>(
  tokens: Token<MediaType>[],
  mediaTypes: MediaType[]
) {
  const misc: Token[] = [];

  const result = Object.fromEntries(
    mediaTypes.map((mediaType) => [mediaType, [] as Token<MediaType>[]])
  ) as { [Type in MediaType]: Token<MediaType>[] };

  const [smallestMediaType] = mediaTypes;

  tokens.forEach((token) => {
    if (!token.mediaType || token.mediaType === smallestMediaType) {
      misc.push(token);
    } else {
      result[token.mediaType].push(token);
    }
  });

  return [
    misc,
    mediaTypes.map((mediaType) => [mediaType, result[mediaType]] as const),
  ] as const;
}

function renderMediaTypePart(children: string[]) {
  if (children.length === 0) return [];

  const start = ":root {";
  const middle = children;
  const end = "}";

  return [start, ...middle, end];
}

function renderMediaTypeTokens(
  mediaQueries: Record<string, string>,
  mediaType: string,
  tokens: Token[]
) {
  if (tokens.length === 0) return [];

  const start = `@media ${mediaQueries[mediaType]} {`;
  const middle = renderMediaTypePart(tokens.map(renderToken));
  const end = "}";

  return [start, ...middle, end];
}

function renderToken(token: Token) {
  return `${token.varName}: ${token.value};`;
}

function toCssString(arr: string[][]) {
  return arr.map((item) => item.join("\n")).join("\n");
}

export function createCss(designTokens: Tokens) {
  const { mediaQueries } = designTokens.options;

  const [misc, mediaTypeTokens] = batchTokens(
    designTokens.tokens,
    Object.keys(mediaQueries)
  );

  const cssArr = [
    renderMediaTypePart(misc.map(renderToken)),
    ...mediaTypeTokens.map(([mediaType, tokens]) =>
      renderMediaTypeTokens(mediaQueries, mediaType, tokens!)
    ),
  ];

  return toCssString(cssArr);
}
