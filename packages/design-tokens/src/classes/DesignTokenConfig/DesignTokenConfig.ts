import { DesignTokenConfigValues } from "./types";

export class DesignTokenConfig<
  Values extends DesignTokenConfigValues = DesignTokenConfigValues
> {
  values: Values;

  constructor(values: Values) {
    this.values = values;
  }
}
