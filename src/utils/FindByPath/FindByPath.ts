export function FindByPath(path: string[], obj: object): unknown {
  return path.reduce((acc, key) => {
    return acc[key as keyof typeof acc];
  }, obj);
}
