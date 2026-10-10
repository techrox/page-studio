import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Block names straight from the registry in packages/blocks/src/config.jsx,
// so a newly registered block gets an e2e page check without editing tests.
export function registeredBlocks() {
  const source = readFileSync(
    fileURLToPath(new URL('../../../packages/blocks/src/config.jsx', import.meta.url)),
    'utf8',
  )
  const body = source.match(/export const defaultBlocks = \{([\s\S]*?)\};/)[1]
  return body
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Collect uncaught page errors and console errors for the life of a test.
export function trackErrors(page) {
  const errors = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })
  return errors
}
