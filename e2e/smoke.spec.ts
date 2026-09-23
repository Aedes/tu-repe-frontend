import { test, expect } from "@playwright/test"

test("home smoke", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("body")).toBeVisible()
})

test("admin sin sesión no muestra panel", async ({ page }) => {
    await page.goto("/admin")
    await expect(page.getByText(/panel-secreto/i)).toHaveCount(0)
    await expect(page).not.toHaveURL(/\/admin$/)
})
