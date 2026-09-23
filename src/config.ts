const backendUrl = import.meta.env.VITE_BACKEND_API_URL as string | undefined

if (import.meta.env.PROD && (!backendUrl || backendUrl.includes("localhost"))) {
    throw new Error("VITE_BACKEND_API_URL de producción no puede estar vacío ni apuntar a localhost")
}

export const BACKEND_API_URL = backendUrl || "/api"
export const DEFAULT_COVER_IMAGE_URL = import.meta.env.VITE_DEFAULT_COVER_IMAGE_URL as string
export const DEFAULT_PROFILE_IMAGE_URL = import.meta.env.VITE_DEFAULT_PROFILE_IMAGE_URL as string
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string
