import { DesignTokenConfig } from "@classes/DesignTokenConfig";
import {
  InferDesignTokenConfigMediaType,
  InferDesignTokenConfigValue,
} from "./types";

export class DesignToken<Config extends DesignTokenConfig<any>> {
  private path: string[];
  private config: Config;

  constructor(path: string[], config: Config) {
    this.path = path;
    this.config = config;
  }

  public value<
    MediaType extends
      | InferDesignTokenConfigMediaType<Config>
      | undefined = undefined
  >(mediaType?: MediaType): InferDesignTokenConfigValue<Config, MediaType> {
    return this.config.values[mediaType ?? "default"];
  }

  get mediaTypes() {
    return Object.keys(this.config.values);
  }

  get dottedPath() {
    return this.path.join(".");
  }

  get key() {
    return `--${this.path.join("-")}`;
  }

  get var() {
    return `var(${this.key})`;
  }
}
