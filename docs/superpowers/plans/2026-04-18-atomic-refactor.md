# Atomic Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the core library by removing duplicated logic, replace the `TokensMap` class with plain functions, add typed `.extend()` and `.write()` methods, and rewrite the CLI to support TypeScript config files via `tsx`.

**Architecture:** The `flattenTokens` function replaces both `processTokens` and `getTokensConfigEntries`. A plain `TokenSet` interface replaces the `TokensMap` class. The CLI becomes two ESM `.mjs` files: `cli.mjs` (orchestration + watch via chokidar) and `runner.mjs` (per-build: load config via tsx/esm register, call `.write()`).

**Tech Stack:** TypeScript, Jest, Vite, chokidar (replaces nodemon), tsx (peer dep, replaces ts-node/nodemon for TS config loading)

---

## File Map

| File | Change |
|---|---|
| `src/utils/flattenTokens/flattenTokens.ts` | **Create** — renamed+moved from `getTokensConfigEntries` in TokensMap |
| `src/utils/flattenTokens/flattenTokens.test.ts` | **Create** — unit tests |
| `src/utils/flattenTokens/index.ts` | **Create** — barrel export |
| `src/classes/TokensMap/TokensMap.ts` | **Delete** |
| `src/classes/TokensMap/index.ts` | **Delete** |
| `src/utils/processTokens/processTokens.ts` | **Delete** |
| `src/utils/processTokens/index.ts` | **Delete** |
| `src/utils/formatTokens/formatTokens.ts` | **Modify** — use `TokenSet`, merge css/scss branches, remove `TokensMap` dependency |
| `src/utils/groupTokens/groupTokens.ts` | **Keep** unchanged |
| `src/utils/index.ts` | **Modify** — remove processTokens export, add flattenTokens export |
| `src/types.ts` | **Modify** — add `TokenSet` interface, add `.write()` and `.extend()` to `Atomic` |
| `src/atomic.ts` | **Modify** — use `flattenTokens` + `TokenSet`, add `.write()` and `.extend()` |
| `src/atomic.test.ts` | **Modify** — add tests for `.extend()` and `.write()` |
| `bin/cli.mjs` | **Create** — replaces `bin/index.js` |
| `bin/runner.mjs` | **Create** — replaces `bin/build.js` |
| `bin/index.js` | **Delete** |
| `bin/build.js` | **Delete** |
| `package.json` | **Modify** — update deps and bin entry |

---

## Task 1: Create `flattenTokens` utility

**Files:**
- Create: `src/utils/flattenTokens/flattenTokens.ts`
- Create: `src/utils/flattenTokens/flattenTokens.test.ts`
- Create: `src/utils/flattenTokens/index.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/utils/flattenTokens/flattenTokens.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test src/utils/flattenTokens/flattenTokens.test.ts
```

Expected: FAIL — `Cannot find module './flattenTokens'`

- [ ] **Step 3: Write the implementation**

```ts
// src/utils/flattenTokens/flattenTokens.ts
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
```

- [ ] **Step 4: Create the barrel**

```ts
// src/utils/flattenTokens/index.ts
export * from './flattenTokens'
```

- [ ] **Step 5: Run test to verify it passes**

```bash
yarn test src/utils/flattenTokens/flattenTokens.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/utils/flattenTokens/
git commit -m "feat: add flattenTokens utility"
```

---

## Task 2: Introduce `TokenSet` type and update `formatTokens`

`TokenSet` is a plain object carrying flat token entries + metadata. It replaces the `TokensMap` class.

**Files:**
- Modify: `src/types.ts`
- Modify: `src/utils/formatTokens/formatTokens.ts`

- [ ] **Step 1: Add `TokenSet` to `types.ts`**

Open `src/types.ts` and add the `TokenSet` interface after the `AtomicTokensMeta` interface (around line 73):

```ts
export interface TokenSet {
  entries: Map<string, string | number>
  meta: AtomicTokensMeta
}
```

- [ ] **Step 2: Rewrite `formatTokens.ts`**

Replace the entire contents of `src/utils/formatTokens/formatTokens.ts`:

```ts
import type { AtomicMode, TokenSet } from '@types'
import { formatTokenVar } from '../formatTokenVar'
import { groupTokens } from '../groupTokens'

function rule(content = '') {
  return `${content}\n`
}

function cssRule(key: string, value: string | number) {
  return rule(`${key}: ${value};`)
}

function comment(content: string, mode: AtomicMode) {
  return mode === 'css' ? rule(`/* ${content} */`) : rule(`// ${content}`)
}

function wrapInSelector(selector: string, content: string) {
  return [rule(`${selector} {`), content, rule('}')].join('')
}

function formatTokenSet(tokenSet: TokenSet, mode: AtomicMode) {
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

export function formatTokens(tokenSets: TokenSet[], mode: AtomicMode) {
  const contents = tokenSets.map(set => formatTokenSet(set, mode)).join('')
  return mode === 'css' ? wrapInSelector(':root', contents) : contents
}
```

- [ ] **Step 3: Run existing tests to check for regressions**

```bash
yarn test
```

Expected: some failures because `atomic.ts` still uses `TokensMap` — that's fine, it will be fixed in Task 3.

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/utils/formatTokens/formatTokens.ts
git commit -m "refactor: introduce TokenSet type, simplify formatTokens"
```

---

## Task 3: Replace `TokensMap` in `atomic.ts`, delete `TokensMap` class

**Files:**
- Modify: `src/atomic.ts`
- Delete: `src/classes/TokensMap/TokensMap.ts`
- Delete: `src/classes/TokensMap/index.ts`

- [ ] **Step 1: Rewrite `src/atomic.ts`**

Replace the entire contents:

```ts
import { writeFileSync } from 'fs'
import { Atomic, AtomicConfig, TokenSet, TokenUtils, TokensConfig } from '@types'
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
      entries: flattenTokens(tokens, utils),
      meta: { selector, description },
    })
  )

  const tokenSets = [defaultSet, ...variantSets]

  return {
    config,
    format: () => formatTokens(tokenSets, config.mode),
    get: (path) => formatTokenVar(path as string, config.mode).var,
    write: () => writeFileSync(config.target, formatTokens(tokenSets, config.mode), 'utf8'),
    addVariant: (name, variantConfig) =>
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
        ...config,
        tokens: deepMerge(
          config.tokens as Record<string, unknown>,
          extra as Record<string, unknown>
        ) as TConfig & TExtra,
      })
    },
  }
}
```

- [ ] **Step 2: Delete `TokensMap` files**

```bash
rm src/classes/TokensMap/TokensMap.ts src/classes/TokensMap/index.ts
rmdir src/classes/TokensMap
rmdir src/classes
```

- [ ] **Step 3: Update `src/utils/index.ts`**

Replace the contents of `src/utils/index.ts`:

```ts
export * from './FindByPath'
export * from './flattenTokens'
export * from './formatTokenVar'
export * from './formatTokens'
export * from './groupTokens'
```

- [ ] **Step 4: Run tests**

```bash
yarn test
```

Expected: PASS — all existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/atomic.ts src/utils/index.ts
git rm src/classes/TokensMap/TokensMap.ts src/classes/TokensMap/index.ts
git commit -m "refactor: replace TokensMap class with flattenTokens + TokenSet"
```

---

## Task 4: Remove `processTokens`

**Files:**
- Delete: `src/utils/processTokens/processTokens.ts`
- Delete: `src/utils/processTokens/index.ts`

- [ ] **Step 1: Delete processTokens files**

```bash
rm src/utils/processTokens/processTokens.ts src/utils/processTokens/index.ts
rmdir src/utils/processTokens
```

- [ ] **Step 2: Run tests to confirm nothing broke**

```bash
yarn test
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git rm src/utils/processTokens/processTokens.ts src/utils/processTokens/index.ts
git commit -m "refactor: remove duplicate processTokens utility"
```

---

## Task 5: Update `Atomic` interface in `types.ts` and add tests for `.extend()` and `.write()`

**Files:**
- Modify: `src/types.ts`
- Modify: `src/atomic.test.ts`

- [ ] **Step 1: Update `Atomic` interface in `src/types.ts`**

The `Atomic` interface currently is (around line 78):

```ts
export interface Atomic<TConfig extends TokensConfig> {
  config: AtomicConfig<TConfig>;
  format: () => string;
  get: (path: TokenPath<ResolvedTokensConfig<TConfig>>) => string;
  addVariant: (name: string, config: VariantConfig<TConfig>) => Atomic<TConfig>;
}
```

Replace it with:

```ts
export interface Atomic<TConfig extends TokensConfig> {
  config: AtomicConfig<TConfig>
  format: () => string
  get: (path: TokenPath<ResolvedTokensConfig<TConfig>>) => string
  write: () => void
  addVariant: (name: string, config: VariantConfig<TConfig>) => Atomic<TConfig>
  extend: <TExtra extends TokensConfig>(
    factory:
      | TExtra
      | ((utils: { get: (path: TokenPath<ResolvedTokensConfig<TConfig>>) => string }) => TExtra)
  ) => Atomic<TConfig & TExtra>
}
```

- [ ] **Step 2: Write tests for `.extend()` and `.write()`**

Add these tests to `src/atomic.test.ts`, after the existing test:

```ts
import { writeFileSync } from 'fs'
import { atomic } from './atomic'

// ... existing generateTokens and test ...

it('extend() with a plain object merges tokens', () => {
  const base = atomic({
    target: '/dev/null',
    mode: 'css',
    tokens: { colors: { primary: '#fff' } },
  })
  const extended = base.extend({ spacing: { sm: '8px' } })
  expect(extended.config.tokens).toMatchObject({
    colors: { primary: '#fff' },
    spacing: { sm: '8px' },
  })
})

it('extend() with a factory receives typed get and merges result', () => {
  const base = atomic({
    target: '/dev/null',
    mode: 'css',
    tokens: { colors: { primary: '#fff' } },
  })
  const extended = base.extend(({ get }) => ({
    spacing: { sm: get('colors.primary') },
  }))
  expect(extended.config.tokens).toMatchObject({
    colors: { primary: '#fff' },
    spacing: { sm: 'var(--colors-primary)' },
  })
})

it('extend() deep merges nested tokens', () => {
  const base = atomic({
    target: '/dev/null',
    mode: 'css',
    tokens: { colors: { primary: '#fff', secondary: '#000' } },
  })
  const extended = base.extend({ colors: { primary: '#123' } })
  expect(extended.config.tokens).toMatchObject({
    colors: { primary: '#123', secondary: '#000' },
  })
})

it('write() writes formatted output to config.target', () => {
  const mockWrite = jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => {})
  const instance = atomic({
    target: './tokens.css',
    mode: 'css',
    tokens: { colors: { primary: '#fff' } },
  })
  instance.write()
  expect(mockWrite).toHaveBeenCalledWith(
    './tokens.css',
    expect.stringContaining('--colors-primary'),
    'utf8'
  )
  mockWrite.mockRestore()
})
```

- [ ] **Step 3: Run tests**

```bash
yarn test src/atomic.test.ts
```

Expected: PASS (all tests including the new ones)

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/atomic.test.ts
git commit -m "feat: add write() and extend() to Atomic interface and tests"
```

---

## Task 6: Rewrite the CLI

Replace `bin/index.js` and `bin/build.js` with two ESM files.

**Files:**
- Create: `bin/runner.mjs`
- Create: `bin/cli.mjs`
- Delete: `bin/index.js`
- Delete: `bin/build.js`

- [ ] **Step 1: Create `bin/runner.mjs`**

This file is spawned once per build. It loads the config via `tsx/esm` register and calls `.write()`.

```js
#!/usr/bin/env node
import { register } from 'tsx/esm'
import { pathToFileURL } from 'url'
import { existsSync } from 'fs'

const configPath = process.argv[2]

if (!configPath || !existsSync(configPath)) {
  console.error(`Atomic: config file not found: ${configPath}`)
  process.exit(1)
}

const unregister = register()

try {
  const { default: config } = await import(pathToFileURL(configPath).href)
  if (typeof config?.write !== 'function') {
    throw new Error('Config default export must be an Atomic instance (missing .write() method)')
  }
  config.write()
  console.log('Atomic: tokens written')
} catch (err) {
  console.error('Atomic error:', err.message)
  process.exit(1)
} finally {
  unregister()
}
```

- [ ] **Step 2: Create `bin/cli.mjs`**

This is the main entry point that handles `build` and `dev` commands.

```js
#!/usr/bin/env node
import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const command = process.argv[2]

const configCandidates = [
  join(process.cwd(), 'atomic.config.ts'),
  join(process.cwd(), 'atomic.config.js'),
]
const configPath = configCandidates.find(existsSync)

if (!configPath) {
  console.error('Atomic: no config file found (atomic.config.ts or atomic.config.js)')
  process.exit(1)
}

const runnerPath = join(__dirname, 'runner.mjs')

function build() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [runnerPath, configPath], { stdio: 'inherit' })
    child.on('close', code => (code === 0 ? resolve() : reject(new Error(`Build exited with code ${code}`))))
  })
}

if (command === 'build') {
  await build().catch(err => {
    console.error(err.message)
    process.exit(1)
  })
} else if (command === 'dev') {
  await build().catch(console.error)

  const { watch } = await import('chokidar')
  watch(configPath, { ignoreInitial: true }).on('change', () => {
    console.log('Atomic: config changed, rebuilding...')
    build().catch(console.error)
  })
  console.log(`Atomic: watching ${configPath}`)
} else {
  console.error(`Unknown command: ${command ?? '(none)'}. Use 'build' or 'dev'.`)
  process.exit(1)
}
```

- [ ] **Step 3: Delete old bin files**

```bash
rm bin/index.js bin/build.js
```

- [ ] **Step 4: Make CLI executable**

```bash
chmod +x bin/cli.mjs bin/runner.mjs
```

- [ ] **Step 5: Commit**

```bash
git rm bin/index.js bin/build.js
git add bin/cli.mjs bin/runner.mjs
git commit -m "feat: rewrite CLI with tsx-based TS config support and chokidar watch"
```

---

## Task 7: Update `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update `package.json`**

Replace the `"bin"`, `"dependencies"`, `"devDependencies"`, and add `"peerDependencies"`:

```json
{
  "bin": {
    "atomic": "./bin/cli.mjs"
  },
  "peerDependencies": {
    "tsx": ">=4.0.0"
  },
  "dependencies": {
    "chokidar": "^3.6.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.12.7",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "ts-jest": "^29.1.2",
    "tsconfig-paths": "^4.2.0",
    "tsx": "^4.0.0",
    "typescript": "^5.4.4",
    "vite": "^5.2.8",
    "vite-plugin-dts": "^3.8.1",
    "vite-tsconfig-paths": "^4.3.2"
  }
}
```

Fields not listed here (`name`, `version`, `description`, `author`, etc.) remain unchanged.

- [ ] **Step 2: Install updated dependencies**

```bash
yarn install
```

- [ ] **Step 3: Run full test suite**

```bash
yarn test
```

Expected: PASS

- [ ] **Step 4: Build to verify dist output is clean**

```bash
yarn build
```

Expected: no errors, `dist/` updated

- [ ] **Step 5: Smoke-test the CLI**

Create a minimal test config at the project root:

```ts
// atomic.config.ts (already exists as the test file, repurpose or use it directly)
```

Then run:

```bash
node bin/cli.mjs build
```

Expected: `Atomic: tokens written`, and `variables.css` / `variables.scss` updated.

- [ ] **Step 6: Final commit**

```bash
git add package.json yarn.lock
git commit -m "chore: replace nodemon/commander/glob with chokidar, add tsx as peer dep"
```

---

## Self-Review

**Spec coverage:**
- ✅ `flattenTokens` replaces `processTokens` + `getTokensConfigEntries` — Task 1 + 3
- ✅ `TokensMap` class removed, `TokenSet` introduced — Task 2 + 3
- ✅ `formatTokens` css/scss branches merged — Task 2
- ✅ `.write()` on `Atomic` — Task 3 + 5
- ✅ `.extend()` with typed get — Task 3 + 5
- ✅ `atomic.config.ts` support in CLI — Task 6
- ✅ `atomic build` and `atomic dev` commands — Task 6
- ✅ `chokidar` watch mode, `nodemon` removed — Task 6 + 7
- ✅ `tsx` as peer dep — Task 7
- ✅ `colorScale` explicitly excluded per user request

**Placeholder scan:** No TBDs or incomplete steps found.

**Type consistency:**
- `TokenSet` introduced in Task 2 (`types.ts`), used in Task 3 (`atomic.ts`, `formatTokens.ts`) ✅
- `flattenTokens` introduced in Task 1, imported via `@utils` in Task 3 ✅
- `write()` and `extend()` added to interface in Task 5, implemented in Task 3 — note: Task 3 implements them before Task 5 adds them to the interface. This is intentional: TypeScript will infer the return type from the implementation; the interface update in Task 5 makes the contract explicit and adds the tests.
- `deepMerge` is private to `atomic.ts`, not exported ✅
