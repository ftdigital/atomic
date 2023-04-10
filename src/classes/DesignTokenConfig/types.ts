import { DesignTokenValue } from "@types";

export interface DesignTokenConfigValues
  extends Partial<Record<string, DesignTokenValue>> {
  default: DesignTokenValue;
}
