import { expect, test } from "@playwright/test"

test("un partido pasa de preparación a un solo video y el fallo muestra partes", async ({ page }) => {
    await page.route("**/challenges.cloudflare.com/**", (route) => route.fulfill({
        contentType: "application/javascript",
        body: "window.turnstile={render(el,opts){opts.callback('token');return '1'},reset(){},remove(){}}",
    }))
    await page.route("**/clubs/c-url/**", (route) => route.fulfill({
        json: {
            name: "Club E2E",
            openTime: "08:00:00",
            closeTime: "09:00:00",
            address: "Calle 1",
            city: "Ciudad",
            province: "Provincia",
        },
    }))
    await page.route("**/courts/cl-url/**", (route) => route.fulfill({
        json: [{ id: "11111111-1111-4111-8111-111111111111", name: "Cancha 1" }],
    }))
    let polls = 0
    await page.route("**/videos/render", (route) => route.fulfill({
        status: 202,
        json: { status: "queued", jobId: "22222222-2222-4222-8222-222222222222", pollAfterMs: 50 },
    }))
    await page.route("**/videos/render/**", (route) => {
        polls += 1
        if (polls < 2) {
            return route.fulfill({ status: 202, json: { status: "processing", jobId: "22222222-2222-4222-8222-222222222222", pollAfterMs: 50 } })
        }
        return route.fulfill({
            json: {
                status: "ready",
                jobId: "22222222-2222-4222-8222-222222222222",
                videoUrl: "https://videos.test/partido.mp4",
                urlExpiresAt: new Date(Date.now() + 3600_000).toISOString(),
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
            },
        })
    })

    await page.goto("/c/cluburl01")
    await page.getByLabel("Selecciona una cancha:").selectOption("11111111-1111-4111-8111-111111111111")
    await page.getByLabel("Selecciona un día:").selectOption({ index: 1 })
    await page.getByLabel("Hora:").selectOption("08:00")
    await expect(page.getByRole("button", { name: "Ver partido" })).toBeEnabled()
    await page.getByRole("button", { name: "Ver partido" }).click()
    await expect(page.getByText("El partido se reproduce en un solo video.")).toBeVisible()
    await expect(page.locator("video")).toHaveAttribute("src", "https://videos.test/partido.mp4")
    await expect(page.getByText(/Dividido en/)).toHaveCount(0)
})

test("si la unión falla se reproducen las partes", async ({ page }) => {
    await page.route("**/challenges.cloudflare.com/**", (route) => route.fulfill({
        contentType: "application/javascript",
        body: "window.turnstile={render(el,opts){opts.callback('token');return '1'},reset(){},remove(){}}",
    }))
    await page.route("**/clubs/c-url/**", (route) => route.fulfill({
        json: { name: "Club E2E", openTime: "08:00:00", closeTime: "09:00:00", address: "Calle 1", city: "Ciudad", province: "Provincia" },
    }))
    await page.route("**/courts/cl-url/**", (route) => route.fulfill({
        json: [{ id: "11111111-1111-4111-8111-111111111111", name: "Cancha 1" }],
    }))
    await page.route("**/videos/render", (route) => route.fulfill({
        status: 202,
        json: { status: "queued", jobId: "33333333-3333-4333-8333-333333333333", pollAfterMs: 50 },
    }))
    await page.route("**/videos/render/**", (route) => route.fulfill({
        json: {
            status: "fallback",
            reason: "merge_failed",
            jobId: "33333333-3333-4333-8333-333333333333",
            parts: [{ url: "https://videos.test/parte.mp4", startTime: new Date().toISOString(), endTime: new Date().toISOString() }],
        },
    }))
    await page.goto("/c/cluburl01")
    await page.getByLabel("Selecciona una cancha:").selectOption("11111111-1111-4111-8111-111111111111")
    await page.getByLabel("Selecciona un día:").selectOption({ index: 1 })
    await page.getByLabel("Hora:").selectOption("08:00")
    await page.getByRole("button", { name: "Ver partido" }).click()
    await expect(page.getByText(/No se pudo unir el video/)).toBeVisible()
    await expect(page.getByRole("button", { name: "Descargar Parte 1" })).toBeVisible()
})
