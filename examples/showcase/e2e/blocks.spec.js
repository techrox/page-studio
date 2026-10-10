import { test, expect } from '@playwright/test'
import { registeredBlocks, trackErrors } from './helpers.js'

const blocks = registeredBlocks()

test('gallery lists every registered block', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/blocks')
  const cards = page.locator('a.gallery-card-link')
  await expect(cards.first()).toBeVisible()
  const hrefs = await cards.evaluateAll((els) =>
    els.map((el) => el.getAttribute('href').split('/').pop()),
  )
  expect(blocks.filter((name) => !hrefs.includes(name))).toEqual([])
  expect(errors).toEqual([])
})

test('clicking a gallery card opens its block page', async ({ page }) => {
  await page.goto('/blocks')
  const first = page.locator('a.gallery-card-link').first()
  const name = await first.getAttribute('aria-label')
  await first.click()
  await expect(page).toHaveURL(new RegExp(`/blocks/${name}$`))
})

for (const name of blocks) {
  test(`block page renders: ${name}`, async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(`/blocks/${name}`)
    await expect(page.getByText(`Unknown block: ${name}`)).toHaveCount(0)
    const frame = page.locator('.block-showcase-render-frame')
    await expect(frame).toBeVisible()
    // Some blocks (Divider, Spacer) have no text, so count elements instead.
    await expect.poll(() => frame.locator('*').count()).toBeGreaterThan(1)
    expect(errors).toEqual([])
  })
}
