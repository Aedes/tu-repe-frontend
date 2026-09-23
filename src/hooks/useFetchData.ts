import { useEffect, useRef, useState } from "react"
import { ApiError, ensureCsrf, getCookie } from "../api/http"
import { BACKEND_API_URL } from "../config"

type FetchMethod = "GET" | "POST" | "PUT" | "DELETE"

export const useFetchData = <TResponse, TBody = unknown>(method: FetchMethod) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<ApiError | Error | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const lastErrorRef = useRef<Error | null>(null)

    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    const fetchData = async (url: string, body?: TBody): Promise<TResponse | null> => {
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        lastErrorRef.current = null
        setIsLoading(true)
        setError(null)
        try {
            await ensureCsrf(BACKEND_API_URL)
            const headers: HeadersInit = {}
            const options: RequestInit = {
                method,
                headers,
                credentials: "include",
                cache: "no-store",
                signal: controller.signal,
            }

            if (method !== "GET") {
                headers["X-CSRF-Token"] = getCookie("tu_repe_csrf")
            }

            if (method !== "GET" && body !== undefined) {
                if (body instanceof FormData) {
                    options.body = body
                } else {
                    headers["Content-Type"] = "application/json"
                    options.body = JSON.stringify(body)
                }
            }

            const response = await fetch(url, options)
            if (!response.ok) {
                let message = `Error: ${response.status}`
                let code: string | undefined
                try {
                    const payload = await response.json() as { message?: string; code?: string }
                    message = payload.message || message
                    code = payload.code
                } catch {
                    /* ignore */
                }
                throw new ApiError(response.status, message, code)
            }

            const contentType = response.headers.get("Content-Type")
            if (contentType?.includes("application/json")) {
                return await response.json() as TResponse
            }
            return await response.blob() as unknown as TResponse
        } catch (err) {
            if ((err as Error).name === "AbortError") return null
            lastErrorRef.current = err as Error
            setError(err as Error)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    return { isLoading, error, fetchData, lastErrorRef }
}
