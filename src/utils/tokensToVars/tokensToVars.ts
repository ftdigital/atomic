import { Token } from "@classes/Token";
import { TokensConfig, TokenVars } from "@types";
import { createVariableName } from "../createVariableName";

export function tokensToVars<
  MediaType extends string,
  TConfig extends TokensConfig<MediaType>
>(tokens: Token[]) {
  let result: any = {};

  tokens.forEach(({ path }) => {
    let clone = result;

    path.forEach((pathItem, index) => {
      if (index === path.length - 1) {
        clone[pathItem] = `var(${createVariableName(path)})`;
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
