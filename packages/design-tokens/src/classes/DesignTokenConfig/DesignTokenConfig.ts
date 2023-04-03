import { DesignTokenConfigValues } from "./types";

export class DesignTokenConfig<Values extends DesignTokenConfigValues> {
  values: Values;

  constructor(values: Values) {
    this.values = values;
  }
}
