import { Token } from "@classes/Token";

export function batchTokens<MediaType extends string>(
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
