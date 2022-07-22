import { Tokens } from "@classes/Tokens";
import { TokensConfig } from "@types";

export function createTokens<MediaType extends string>(
  mediaQueries: Record<MediaType, string>,
  tokens: TokensConfig<MediaType> = {}
) {
  return new Tokens(mediaQueries, tokens);
}
