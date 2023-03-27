import { TokenValue } from "@types";

export class Token<MediaType extends string = string> {
  path: string[];
  value: TokenValue;
  mediaType?: MediaType;

  constructor(path: string[], value: TokenValue, mediaType?: MediaType) {
    this.path = path;
    this.value = value;
    this.mediaType = mediaType;
  }

  get isResponsive() {
    return Boolean(this.mediaType);
  }

  get varName() {
    return `--${this.path.join("-")}`;
  }

  get var() {
    return `var(${this.varName})`;
  }
}
