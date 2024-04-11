import { AtomicMode } from "@types";

export function formatTokenVar(path: string, mode: AtomicMode) {
  switch (mode) {
    case "css": {
      const key = `--${path}`;
      return {
        key,
        var: `var(${key})`,
      };
    }
    case "sass":
    case "scss": {
      const key = `$${path}`;
      return {
        key,
        var: key,
      };
    }
    default:
      throw new Error(`No formatting found for type ${mode}`);
  }
}
