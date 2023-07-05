import { Atomic } from "@classes/Atomic";
import { AtomicTokenInstance } from "@types";

export class AtomicToken<Value extends string | number = string | number>
  implements AtomicTokenInstance
{
  constructor(
    protected atomic: Atomic<any>,
    public path: string[],
    public value: Value
  ) {}

  get key() {
    return this.path.join(".");
  }

  get type() {
    const [type] = this.path;
    return type!;
  }

  private get varFormat() {
    switch (this.atomic.config.mode) {
      case "css": {
        const key = `--${this.name}`;
        return {
          key,
          var: `var(${key})`,
        };
      }
      case "sass":
      case "scss": {
        const key = `$${this.name}`;
        return {
          key,
          var: key,
        };
      }
      default:
        throw new Error(
          `No formatting found for type ${this.atomic.config.mode}`
        );
    }
  }

  get varKey() {
    return this.varFormat.key;
  }

  get var() {
    return this.varFormat.var;
  }

  get name() {
    return this.path.join("-").replace(".", "-");
  }
}
