import { test, expect } from '@playwright/test'
import { trackErrors } from './helpers.js'

test('editor loads the page into the canvas and publishes', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/editor')

  await expect(page.locator('.psd-builder-bar')).toBeVisible()
  await expect(page.getByText('Loading editor…')).toHaveCount(0)

  // Puck mounts the canvas in an iframe; the home page's blocks render there.
  const canvas = page.frameLocator('iframe').first()
  await expect(canvas.locator('body')).not.toBeEmpty({ timeout: 30_000 })

  await page.locator('.psd-builder-bar').getByRole('button', { name: /publish/i }).click()
  // Both toasts: the host adapter's own, then the editor's confirmation.
  await expect(page.locator('.ant-message').getByText(/Saved \(in-memory only/)).toBeVisible()
  await expect(page.locator('.ant-message').getByText('Published.')).toBeVisible()

  expect(errors).toEqual([])
})
