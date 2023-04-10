import { DesignTokenConfig } from "@classes/DesignTokenConfig";
import {
  InferDesignTokenConfigMediaType,
  InferDesignTokenConfigValue,
} from "./types";

export class DesignToken<Config extends DesignTokenConfig> {
  private path: string[];
  private config: Config;

  constructor(path: string[], config: Config) {
    this.path = path;
    this.config = config;
  }

  value(): InferDesignTokenConfigValue<Config>;
  value<MediaType extends InferDesignTokenConfigMediaType<Config>>(
    mediaType: MediaType
  ): InferDesignTokenConfigValue<Config, MediaType>;
  value<MediaType extends string>(
    mediaType?: MediaType
  ): InferDesignTokenConfigValue<Config, MediaType> {
    return this.config.values[
      mediaType ?? "default"
    ] as InferDesignTokenConfigValue<Config, MediaType>;
  }

  get mediaTypes() {
    return Object.keys(this.config.values).filter(
      (value) => value !== "default"
    ) as InferDesignTokenConfigMediaType<Config>[];
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
