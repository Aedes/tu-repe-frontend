export class ApiError extends Error {
    status: number
    code?: string

    constructor(status: number, message: string, code?: string) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.code = code
    }
}

export const getCookie = (name: string) => {
    const raw = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
    return raw ? decodeURIComponent(raw.split("=")[1]) : ""
}

export const ensureCsrf = async (apiBase: string) => {
    if (!getCookie("tu_repe_csrf")) {
        await fetch(`${apiBase}/auth/csrf`, { credentials: "include" })
    }
}
