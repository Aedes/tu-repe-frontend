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
    await page.route("**/videos/render", (route) => {
        const body = route.request().postDataJSON() as { mode?: string }
        if (body.mode === "unified") {
            return route.fulfill({
                status: 202,
                json: { status: "queued", jobId: "22222222-2222-4222-8222-222222222222", pollAfterMs: 50 },
            })
        }
        return route.fulfill({
            json: {
                status: "choice",
                continuationToken: "continuation-token-for-e2e-search",
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                parts: [{ url: "https://videos.test/parte.mp4", startTime: new Date().toISOString(), endTime: new Date().toISOString() }],
            },
        })
    })
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
                endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                playbackStartTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            },
        })
    })

    await page.goto("/c/cluburl01")
    await page.getByLabel("Selecciona una cancha:").selectOption("11111111-1111-4111-8111-111111111111")
    await page.getByLabel("Selecciona un día:").selectOption({ index: 1 })
    await page.getByLabel("Hora:").selectOption("08:00")
    await expect(page.getByRole("button", { name: "Buscar partido" })).toBeEnabled()
    await page.getByRole("button", { name: "Buscar partido" }).click()
    await expect(page.getByRole("button", { name: "Preparar video completo" })).toBeVisible()
    await page.getByRole("button", { name: "Preparar video completo" }).click()
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
    await page.route("**/videos/render", (route) => {
        const body = route.request().postDataJSON() as { mode?: string }
        if (body.mode === "unified") {
            return route.fulfill({
                status: 202,
                json: { status: "queued", jobId: "33333333-3333-4333-8333-333333333333", pollAfterMs: 50 },
            })
        }
        return route.fulfill({
            json: {
                status: "choice",
                continuationToken: "continuation-token-for-e2e-fallback",
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                parts: [{ url: "https://videos.test/parte.mp4", startTime: new Date().toISOString(), endTime: new Date().toISOString() }],
            },
        })
    })
    await page.route("**/videos/render/**", (route) => route.fulfill({
        json: {
            status: "fallback",
            reason: "merge_failed",
            jobId: "33333333-3333-4333-8333-333333333333",
            parts: [{ url: "https://videos.test/parte.mp4", startTime: new Date().toISOString(), endTime: new Date().toISOString() }],
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
    }))
    await page.goto("/c/cluburl01")
    await page.getByLabel("Selecciona una cancha:").selectOption("11111111-1111-4111-8111-111111111111")
    await page.getByLabel("Selecciona un día:").selectOption({ index: 1 })
    await page.getByLabel("Hora:").selectOption("08:00")
    await page.getByRole("button", { name: "Buscar partido" }).click()
    await page.getByRole("button", { name: "Preparar video completo" }).click()
    await expect(page.getByText(/No se pudo unir el video/)).toBeVisible()
    await expect(page.getByRole("button", { name: "Descargar Parte 1" })).toBeVisible()
})

test("marcar un rango descarga el clip generado en el servidor", async ({ page }) => {
    const appointmentStart = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const appointmentEnd = new Date().toISOString()
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
        json: {
            status: "ready",
            videoUrl: "https://videos.test/partido.mp4",
            urlExpiresAt: new Date(Date.now() + 3600_000).toISOString(),
            startTime: appointmentStart,
            endTime: appointmentEnd,
            playbackStartTime: appointmentStart,
        },
    }))
    let clipBody: Record<string, unknown> | null = null
    await page.route("**/clips/extract", async (route) => {
        clipBody = route.request().postDataJSON()
        await route.fulfill({
            status: 200,
            contentType: "video/mp4",
            headers: { "Content-Disposition": "attachment; filename=\"clip-tu-repe.mp4\"" },
            body: Buffer.from("mp4"),
        })
    })

    await page.context().addCookies([{ name: "tu_repe_csrf", value: "token", url: "http://127.0.0.1:4173" }])
    await page.goto("/c/cluburl01")
    await page.getByLabel("Selecciona una cancha:").selectOption("11111111-1111-4111-8111-111111111111")
    await page.getByLabel("Selecciona un día:").selectOption({ index: 1 })
    await page.getByLabel("Hora:").selectOption("08:00")
    await page.getByRole("button", { name: "Buscar partido" }).click()
    await expect(page.locator("video")).toBeVisible()
    await page.locator("video").evaluate((video: HTMLVideoElement) => {
        let time = 2
        Object.defineProperty(video, "currentTime", {
            configurable: true,
            get: () => time,
            set: (value: number) => { time = value },
        })
        video.play = () => Promise.resolve()
    })
    await page.getByRole("button", { name: "Grabar Clip" }).click()
    await page.locator("video").evaluate((video: HTMLVideoElement) => {
        video.currentTime = 8
    })
    await page.getByRole("button", { name: "Detener" }).click()
    await expect(page.getByRole("heading", { name: "Clip seleccionado correctamente" })).toBeVisible()
    await page.getByRole("button", { name: "Descargar clip" }).click()
    await expect.poll(() => clipBody).toMatchObject({
        clubUrlId: "cluburl01",
        courtId: "11111111-1111-4111-8111-111111111111",
        appointmentStartTime: appointmentStart,
        offsetMs: 2_000,
        durationMs: 6_000,
        turnstileToken: "token",
    })
    expect(clipBody).not.toHaveProperty("url")
    expect(clipBody).not.toHaveProperty("b2FilePath")
})

test("una grabación con cortes se reproduce por partes sin ofrecer el video completo", async ({ page }) => {
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
        json: {
            status: "parts",
            notice: "gaps",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            parts: [{ url: "https://videos.test/parte.mp4", startTime: new Date().toISOString(), endTime: new Date().toISOString() }],
        },
    }))
    await page.goto("/c/cluburl01")
    await page.getByLabel("Selecciona una cancha:").selectOption("11111111-1111-4111-8111-111111111111")
    await page.getByLabel("Selecciona un día:").selectOption({ index: 1 })
    await page.getByLabel("Hora:").selectOption("08:00")
    await page.getByRole("button", { name: "Buscar partido" }).click()
    await expect(page.getByText("La grabación tiene interrupciones y se mostrará por partes.")).toBeVisible()
    await expect(page.getByRole("button", { name: "Preparar video completo" })).toHaveCount(0)
    await expect(page.locator("video")).toBeVisible()
})
