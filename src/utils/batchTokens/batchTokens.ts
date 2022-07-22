import { Token } from "@classes/Token";

export function batchTokens<MediaType extends string>(
  tokens: Token<MediaType>[],
  mediaTypes: MediaType[]
) {
  const misc: Token[] = [];

  const result = Object.fromEntries(
    mediaTypes.map((mediaType) => [mediaType, [] as Token<MediaType>[]])
  ) as { [Type in MediaType]: Token<MediaType>[] };

  tokens.forEach((token) => {
    if (token.mediaType) {
      result[token.mediaType].push(token);
    } else {
      misc.push(token);
    }
  });

  return [
    misc,
    mediaTypes.map((mediaType) => [mediaType, result[mediaType]] as const),
  ] as const;
}
