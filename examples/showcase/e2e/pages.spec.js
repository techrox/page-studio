import { test, expect } from '@playwright/test'
import { trackErrors } from './helpers.js'

const SLUGS = ['home', 'about', 'services', 'contact', 'pulsar']

for (const slug of SLUGS) {
  test(`sample page renders: ${slug}`, async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(`/pages/${slug}`)
    await expect(page.locator('#root')).not.toBeEmpty()
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
}
