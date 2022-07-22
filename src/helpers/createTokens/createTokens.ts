import { Tokens } from "@classes/Tokens";
import { TokensConfig } from "@types";

export function createTokens<
  MediaType extends string,
  TConfig extends TokensConfig<MediaType>
>(mediaQueries: Record<MediaType, string>, tokens: TConfig) {
  return new Tokens(mediaQueries, tokens);
}
