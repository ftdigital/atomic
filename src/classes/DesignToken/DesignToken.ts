import { DesignTokensFormatType } from "@types";

export class DesignToken<Value extends string | number = string | number> {
  constructor(public path: string[], public value: Value) {}

  get key() {
    return this.path.join(".");
  }

  format(type: DesignTokensFormatType) {
    switch (type) {
      case "css":
        return {
          key: `--${this.name}`,
          name: `var(${this.name})`,
        };
      case "sass":
        return {
          key: `$${this.name}`,
          name: `$${this.name}`,
        };
      default:
        throw new Error(`No formatting found for type ${type}`);
    }
  }

  get name() {
    return this.path.join("-");
  }
}
