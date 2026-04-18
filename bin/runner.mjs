#!/usr/bin/env node
import { register } from 'tsx/esm/api'
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
