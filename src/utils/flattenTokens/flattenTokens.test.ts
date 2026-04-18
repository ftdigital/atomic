import { flattenTokens } from './flattenTokens'

const utils = { get: (path: string) => `var(--${path})` }

it('flattens a nested token object into dot-path entries', () => {
  const result = flattenTokens({ colors: { primary: '#fff', secondary: '#000' } }, utils)
  expect(result.get('colors.primary')).toBe('#fff')
  expect(result.get('colors.secondary')).toBe('#000')
})

it('collapses "default" keys to the parent path', () => {
  const result = flattenTokens({ colors: { brand: { default: '#abc', dark: '#123' } } }, utils)
  expect(result.get('colors.brand')).toBe('#abc')
  expect(result.get('colors.brand.dark')).toBe('#123')
})

it('resolves function values by calling them with utils', () => {
  const result = flattenTokens(
    { colors: { ui: { border: ({ get }: typeof utils) => get('colors.primary') } } },
    utils
  )
  expect(result.get('colors.ui.border')).toBe('var(--colors.primary)')
})

it('handles numeric values', () => {
  const result = flattenTokens({ spacing: { sm: 8 } }, utils)
  expect(result.get('spacing.sm')).toBe(8)
})
