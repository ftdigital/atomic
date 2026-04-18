# Atomic Refactor Design

**Date:** 2026-04-18

## Goal

Simplify the core library by removing duplicated code, add a typed `.extend()` API for cross-referencing tokens, and replace the brittle CLI with a `tsx`-based approach that supports TypeScript config files natively.

---

## 1. Core Library

### Simplifications

**Remove duplicated logic:**
- `processTokens` (`src/utils/processTokens/processTokens.ts`) and `getTokensConfigEntries` (`src/classes/TokensMap/TokensMap.ts`) are identical. Remove `processTokens`, rename `getTokensConfigEntries` to `flattenTokens` and keep it as the single implementation.
- `TokensMap.group()` and the standalone `groupTokens` function (`src/utils/groupTokens/groupTokens.ts`) are identical. Remove the `group()` method from `TokensMap`.
- `formatTokens` has identical `css` and `scss`/`sass` branches — merge them.

**Remove `TokensMap` class:**
- `TokensMap` currently extends `Map<string, string|number>` and carries a `meta` property. Replace with a plain `Map<string, string|number>` and pass `meta` separately as a plain object where needed.

### New `.extend()` method

`Atomic<TConfig>` gets an `.extend()` method that returns a new `Atomic` with merged tokens. It accepts either a plain tokens object or a factory callback. The callback receives a `get` function typed with the paths of the current config — no circular inference because `TConfig` is already resolved at call time.

```ts
// Plain object (no refs needed)
base.extend({ spacing: { sm: '8px' } })

// Factory with typed get
base.extend(({ get }) => ({
  colors: { ui: { border: get('colors.neutrals.300') } }
}))

// Chainable
base
  .extend({ spacing: { sm: '8px' } })
  .extend(({ get }) => ({
    colors: { ui: { border: get('colors.neutrals.300') } }
  }))
```

Type signature:
```ts
extend<TExtra extends TokensConfig>(
  tokens: TExtra | ((utils: { get: (path: TokenPath<ResolvedTokensConfig<TConfig>>) => string }) => TExtra)
): Atomic<TConfig & TExtra>
```

The existing `addVariant()` method is unchanged.

### New `.write()` method

`Atomic` gets a `.write()` method that combines `format()` + `writeFileSync` to `config.target`. Used by the CLI runner internally.

```ts
write(): void // writes formatted output to config.target
```

---

## 2. CLI

### Current problems

- Glob root is `__dirname` (inside `node_modules`) — never finds user config files
- Looks for `*.atomic.{cjs,js}` — requires compiled JS, no TypeScript support
- `nodemon`, `commander`, `glob`, `ts-node` are in `dependencies` — installed by consumers unnecessarily
- No support for `atomic.config.ts`

### New approach

Replace `bin/index.js` + `bin/build.js` with a single `bin/cli.ts` that uses `tsx` to import and execute `atomic.config.ts`.

**Config discovery:** look for `atomic.config.ts` (falling back to `atomic.config.js`) in `process.cwd()`.

**Commands:**

| Command | Behaviour |
|---|---|
| `atomic build` | Import config, call `.write()`, exit |
| `atomic dev` | Import config, call `.write()`, then watch for changes and re-run |

**Watch mode:** use `chokidar` to watch `atomic.config.ts` and re-execute on change. Lightweight alternative to `nodemon`.

**Dependencies:**
- `tsx` — peer dependency (users install it themselves, already standard in TS projects)
- `chokidar` — small watch library, replaces `nodemon`
- Remove: `nodemon`, `ts-node`, `commander`, `glob`

### User setup

```ts
// atomic.config.ts
import { atomic } from '@ftdigital/atomic'

const base = atomic({
  mode: 'css',
  target: './src/styles/tokens.css',
  tokens: {
    colors: { neutrals: { 300: '#d6d3d1' } }
  }
})

export default base.extend(({ get }) => ({
  colors: {
    ui: { border: get('colors.neutrals.300') }
  }
}))
```

```json
// package.json
"scripts": {
  "dev": "atomic dev",
  "prebuild": "atomic build"
}
```

---

## 3. Files Changed

| File | Action |
|---|---|
| `src/utils/processTokens/` | Remove entirely |
| `src/utils/groupTokens/groupTokens.ts` | Keep as standalone `groupTokens`, remove from `TokensMap` |
| `src/classes/TokensMap/TokensMap.ts` | Remove class, keep `flattenTokens` (renamed from `getTokensConfigEntries`) as plain function |
| `src/utils/formatTokens/formatTokens.ts` | Merge duplicate css/scss branches |
| `src/atomic.ts` | Add `.extend()` and `.write()` to returned object |
| `src/types.ts` | Add `.extend()` and `.write()` to `Atomic` interface |
| `src/utils/colorScale/colorScale.ts` | New utility: `colorScale(base, factory)` helper |
| `bin/index.js` + `bin/build.js` | Replace with `bin/cli.ts` |
| `package.json` | Remove `nodemon`, `ts-node`, `commander`, `glob`; add `chokidar`; add `tsx` as peer dependency |

---

## 4. New `colorScale` Utility

A pure helper for generating color palettes from a base color. No changes to the core config processor.

```ts
import { atomic, colorScale } from '@ftdigital/atomic'

colors: {
  primary: colorScale('#FA755A', (base) => ({
    50: tint(0.95, base),
    500: base,
    950: shade(0.8, base),
  }))
}
```

Returns `{ default: base, ...factory(base) }`.

---

## 5. What Does Not Change

- Public `atomic(config)` API — existing configs continue to work
- `addVariant()` method
- Output format (CSS/SCSS file contents)
- `format()` method
- `config` and `get` properties on `Atomic`
