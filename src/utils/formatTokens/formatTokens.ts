import type { AtomicVarType, TokenSet } from '@types'
import { formatTokenVar } from '../formatTokenVar'
import { groupTokens } from '../groupTokens'

function rule(content = '') {
  return `${content}\n`
}

function cssRule(key: string, value: string | number) {
  return rule(`${key}: ${value};`)
}

function comment(content: string, mode: AtomicVarType) {
  return mode === 'css' ? rule(`/* ${content} */`) : rule(`// ${content}`)
}

function wrapInSelector(selector: string, content: string) {
  return [rule(`${selector} {`), content, rule('}')].join('')
}

function formatTokenSet(tokenSet: TokenSet, mode: AtomicVarType) {
  const grouped = groupTokens(Array.from(tokenSet.entries))

  const contents = Array.from(grouped)
    .map(([type, tokens]) => {
      const rules = [comment(`${type} variables`, mode)]
      tokens.forEach(([path, value]) =>
        rules.push(cssRule(formatTokenVar(path, mode).key, value))
      )
      rules.push(rule())
      return rules.join('')
    })
    .join('')

  return tokenSet.meta.selector
    ? wrapInSelector(tokenSet.meta.selector, contents)
    : contents
}

export function formatTokens(tokenSets: TokenSet[], mode: AtomicVarType) {
  const contents = tokenSets.map(set => formatTokenSet(set, mode)).join('')
  return mode === 'css' ? wrapInSelector(':root', contents) : contents
}
