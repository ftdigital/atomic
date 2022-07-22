import { Token } from "@classes/Token";
import { TokensConfig, TokenVars } from "@types";

export function tokensToVars<
  MediaType extends string,
  TConfig extends TokensConfig<MediaType>
>(tokens: Token[]) {
  let result: any = {};

  tokens.forEach((token) => {
    let clone = result;

    token.path.forEach((pathItem, index) => {
      if (index === token.path.length - 1) {
        clone[pathItem] = `var(${token.var})`;
      } else if (typeof clone[pathItem] === "object") {
        clone[pathItem] = Object.assign({}, clone[pathItem]);
      } else {
        clone[pathItem] = {};
      }

      clone = clone[pathItem];
    });
  });

  return result as TokenVars<TConfig, MediaType>;
}
