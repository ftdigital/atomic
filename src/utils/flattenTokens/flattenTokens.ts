import type { TokenUtils, TokensConfig } from '@types'

function isValue(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number'
}

export function flattenTokens(
  config: TokensConfig | Record<string, unknown>,
  utils: TokenUtils
): Map<string, string | number> {
  const map = new Map<string, string | number>()

  function loop(obj: Record<string, unknown>, path: string[] = []) {
    for (const key in obj) {
      const resolvedPath = key === 'default' ? path : [...path, key]
      const stringPath = resolvedPath.join('.')
      const value = obj[key]
      const resolved = typeof value === 'function' ? value(utils) : value

      if (isValue(resolved)) {
        map.set(stringPath, resolved)
      } else if (resolved !== null && typeof resolved === 'object') {
        loop(resolved as Record<string, unknown>, resolvedPath)
      }
    }
  }

  loop(config as Record<string, unknown>)
  return map
}
