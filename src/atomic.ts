import { writeFileSync } from 'fs'
import { Atomic, AtomicConfig, TokenSet, TokensConfig, VariantConfig } from '@types'
import { flattenTokens, formatTokens, formatTokenVar } from '@utils'

function deepMerge(
  base: Record<string, unknown>,
  ext: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(ext)) {
    if (
      typeof ext[key] === 'object' && ext[key] !== null && !Array.isArray(ext[key]) &&
      typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        ext[key] as Record<string, unknown>
      )
    } else {
      result[key] = ext[key]
    }
  }
  return result
}

export function atomic<
  TConfig extends TokensConfig,
  TVariants extends Record<string, VariantConfig<TConfig>> = Record<string, VariantConfig<TConfig>>
>(config: AtomicConfig<TConfig, TVariants>): Atomic<TConfig, TVariants> {
  const defaultSet: TokenSet = {
    entries: flattenTokens(config.tokens),
    meta: {},
  }

  const variantMap = new Map(
    Object.entries(config.variants ?? {}).map(([name, { tokens, selector, description }]) => [
      name,
      { entries: flattenTokens(tokens as any), meta: { selector, description } } satisfies TokenSet,
    ])
  )

  const tokenSets = [defaultSet, ...variantMap.values()]

  function resolveVarType() {
    if (!config.varType) throw new Error('varType is required for this operation')
    return config.varType
  }

  const instance = {
    config,
    format: () => formatTokens(tokenSets, resolveVarType()),
    ref: (path: string) => formatTokenVar(path, resolveVarType()).var,
    value: (path: string, variant?: keyof TVariants) =>
      (variant ? variantMap.get(variant as string)?.entries.get(path) ?? defaultSet.entries.get(path) : defaultSet.entries.get(path)) as any,
    write: () => {
      if (!config.filePath) throw new Error('filePath is required to write tokens')
      writeFileSync(config.filePath, formatTokens(tokenSets, resolveVarType()), 'utf8')
    },
    extend: <TExtra extends TokensConfig>(
      factory: TExtra | ((utils: { ref: (path: string) => string }) => TExtra),
      overrides?: { varType?: typeof config.varType; filePath?: string }
    ): Atomic<TConfig & TExtra> => {
      const extra =
        typeof factory === 'function'
          ? (factory as (utils: { ref: (path: string) => string }) => TExtra)({ ref: (path: string) => formatTokenVar(path, resolveVarType()).var })
          : factory
      return atomic<TConfig & TExtra>({
        ...(config as any),
        ...overrides,
        tokens: deepMerge(
          config.tokens as Record<string, unknown>,
          extra as Record<string, unknown>
        ) as TConfig & TExtra,
      })
    },
  }

  return instance
}
