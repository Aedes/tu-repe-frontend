const backendUrl = import.meta.env.VITE_BACKEND_API_URL as string | undefined
const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined
const configuredRtmpHost = import.meta.env.VITE_RTMP_PUBLISH_HOST as string | undefined

if (import.meta.env.PROD && (!backendUrl || backendUrl.includes("localhost"))) {
    throw new Error("VITE_BACKEND_API_URL de producción no puede estar vacío ni apuntar a localhost")
}

export const BACKEND_API_URL = backendUrl || "/api"
export const PUBLIC_SITE_URL = (configuredSiteUrl || window.location.origin).replace(/\/+$/, "")
export const RTMP_PUBLISH_HOST = configuredRtmpHost || `${window.location.hostname}:1935`
export const DEFAULT_COVER_IMAGE_URL = import.meta.env.VITE_DEFAULT_COVER_IMAGE_URL as string
export const DEFAULT_PROFILE_IMAGE_URL = import.meta.env.VITE_DEFAULT_PROFILE_IMAGE_URL as string
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string
