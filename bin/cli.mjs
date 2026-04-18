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
    child.on('error', reject)
  })
}

if (command === 'build') {
  await build().catch(err => {
    console.error(err.message)
    process.exit(1)
  })
} else if (command === 'dev') {
  await build().catch(err => {
    console.error(err.message)
    console.log('Atomic: watching despite initial failure — fix the config to rebuild')
  })

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
