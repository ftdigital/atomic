export function createVariableName(path: string[]) {
  return `--${path.join("-")}`;
}
