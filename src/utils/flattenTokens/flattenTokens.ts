import type { TokensConfig } from '@types'

function isValue(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number'
}

export function flattenTokens(
  config: TokensConfig | Record<string, unknown>
): Map<string, string | number> {
  const map = new Map<string, string | number>()

  function loop(obj: Record<string, unknown>, path: string[] = []) {
    for (const key in obj) {
      const resolvedPath = key === 'default' ? path : [...path, key]
      const stringPath = resolvedPath.join('.')
      const value = obj[key]

      if (isValue(value)) {
        map.set(stringPath, value)
      } else if (value !== null && typeof value === 'object') {
        loop(value as Record<string, unknown>, resolvedPath)
      }
    }
  }

  loop(config as Record<string, unknown>)
  return map
}
