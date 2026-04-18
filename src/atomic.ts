import { writeFileSync } from 'fs'
import { Atomic, AtomicConfig, TokenSet, TokenUtils, TokensConfig, VariantConfig } from '@types'
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

export function atomic<TConfig extends TokensConfig>(
  config: AtomicConfig<TConfig>
): Atomic<TConfig> {
  const utils: TokenUtils = {
    get: (path) => formatTokenVar(path, config.mode).var,
  }

  const defaultSet: TokenSet = {
    entries: flattenTokens(config.tokens, utils),
    meta: {},
  }

  const variantSets: TokenSet[] = Object.entries(config.variants ?? {}).map(
    ([, { tokens, selector, description }]) => ({
      entries: flattenTokens(tokens as any, utils),
      meta: { selector, description },
    })
  )

  const tokenSets = [defaultSet, ...variantSets]

  const instance = {
    config,
    format: () => formatTokens(tokenSets, config.mode),
    get: (path: string) => formatTokenVar(path, config.mode).var,
    write: () => writeFileSync(config.target, formatTokens(tokenSets, config.mode), 'utf8'),
    addVariant: (name: string, variantConfig: VariantConfig<TConfig>) =>
      atomic<TConfig>({
        ...config,
        variants: { ...config.variants, [name]: variantConfig },
      }),
    extend: <TExtra extends TokensConfig>(
      factory: TExtra | ((utils: { get: (path: string) => string }) => TExtra)
    ): Atomic<TConfig & TExtra> => {
      const extra =
        typeof factory === 'function'
          ? factory({ get: (path) => formatTokenVar(path, config.mode).var })
          : factory
      return atomic<TConfig & TExtra>({
        ...(config as any),
        tokens: deepMerge(
          config.tokens as Record<string, unknown>,
          extra as Record<string, unknown>
        ) as TConfig & TExtra,
      })
    },
  }

  return instance as unknown as Atomic<TConfig>
}
