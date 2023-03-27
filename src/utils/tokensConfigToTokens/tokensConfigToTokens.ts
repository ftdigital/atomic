import { Token } from "@classes/Token";
import { TokenKey, TokensConfig } from "@types";

function tokensConfigToTokens<
  MediaType extends string,
  TConfig extends TokensConfig<MediaType>
>(tokensConfig: TConfig, mediaTypes: MediaType[]) {
  const tokens: Token<MediaType>[] = [];

  function loop(obj: TokensConfig, path: string[] = []) {
    for (const key in obj) {
      const value = obj[key]!;
      const keyIsMediaType = mediaTypes.includes(key as MediaType);
      const mediaType = keyIsMediaType ? (key as MediaType) : undefined;

      if (typeof value === "string" || typeof value === "number") {
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

export function tokensConfigToTokensMap<
  MediaType extends string,
  TConfig extends TokensConfig<MediaType>
>(tokensConfig: TConfig, mediaTypes: MediaType[]) {
  const tokens = tokensConfigToTokens(tokensConfig, mediaTypes);

  return new Map(
    tokens.map((token) => {
      const pathWithMediaType = (
        token.mediaType ? [...token.path, token.mediaType] : token.path
      ).join(".") as TokenKey<TConfig>;

      return [pathWithMediaType, token];
    })
  );
}
