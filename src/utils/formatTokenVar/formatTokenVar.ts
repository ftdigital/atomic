import { AtomicMode } from "@types";

export function formatTokenVar(path: string, mode: AtomicMode) {
  const formattedPath = path.split(".").join("-");

  switch (mode) {
    case "css": {
      const key = `--${formattedPath}`;
      return {
        key,
        var: `var(${key})`,
      };
    }
    case "sass":
    case "scss": {
      const key = `$${formattedPath}`;
      return {
        key,
        var: key,
      };
    }
    default:
      throw new Error(`No formatting found for type ${mode}`);
  }
}
