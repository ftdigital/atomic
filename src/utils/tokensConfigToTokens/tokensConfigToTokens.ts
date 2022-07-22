import { Token } from "@classes/Token";
import { TokensConfig } from "@types";

export function tokensConfigToTokens<MediaType extends string>(
  tokensConfig: TokensConfig<MediaType>,
  mediaTypes: MediaType[]
) {
  const tokens: Token<MediaType>[] = [];

  function loop(obj: TokensConfig, path: string[] = []) {
    for (const key in obj) {
      const value = obj[key]!;

      if (typeof value === "string" || typeof value === "number") {
        const keyIsMediaType = mediaTypes.includes(key as MediaType);
        const mediaType = keyIsMediaType ? (key as MediaType) : undefined;

        tokens.push(
          new Token(keyIsMediaType ? path : [...path, key], value, mediaType)
        );
      } else {
        loop(value, [...path, key]);
      }
    }
  }

  loop(tokensConfig);

  return tokens;
}
