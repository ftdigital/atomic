import { DesignTokenValue } from "@types";

export interface DesignTokenConfigValues
  extends Record<string, DesignTokenValue> {
  default: DesignTokenValue;
}
