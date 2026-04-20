import { flattenTokens } from './flattenTokens'

it('flattens a nested token object into dot-path entries', () => {
  const result = flattenTokens({ colors: { primary: '#fff', secondary: '#000' } })
  expect(result.get('colors.primary')).toBe('#fff')
  expect(result.get('colors.secondary')).toBe('#000')
})

it('collapses "default" keys to the parent path', () => {
  const result = flattenTokens({ colors: { brand: { default: '#abc', dark: '#123' } } })
  expect(result.get('colors.brand')).toBe('#abc')
  expect(result.get('colors.brand.dark')).toBe('#123')
})

it('handles numeric values', () => {
  const result = flattenTokens({ spacing: { sm: 8 } })
  expect(result.get('spacing.sm')).toBe(8)
})
