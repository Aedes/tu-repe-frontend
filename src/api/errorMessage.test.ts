import { describe, expect, it } from "vitest"
import { ApiError } from "./http"
import { userFacingError } from "./errorMessage"

describe("userFacingError", () => {
    it("traduce mensajes conocidos y conserva la acción", () => {
        const error = new ApiError(400, "A user with that email already exists.", "BAD_REQUEST")
        expect(userFacingError(error, "No se pudo crear el usuario")).toBe(
            "No se pudo crear el usuario. Ya existe un usuario con ese email."
        )
    })

    it("muestra la regla de contraseña que devuelve el servidor", () => {
        const error = new ApiError(400, "La contraseña debe incluir una mayúscula", "BAD_REQUEST")
        expect(userFacingError(error, "No se pudo crear el usuario")).toBe(
            "No se pudo crear el usuario. La contraseña debe incluir una mayúscula."
        )
    })

    it("explica una preparación que tardó demasiado", () => {
        const error = new Error("La preparación tardó demasiado")
        expect(userFacingError(error, "No se pudo buscar el partido")).toBe(
            "No se pudo buscar el partido. La preparación del video tardó demasiado. Probá de nuevo."
        )
    })

    it("explica el límite de intentos", () => {
        const error = new ApiError(429, "Demasiadas solicitudes", "RATE_LIMITED")
        expect(userFacingError(error, "No se pudo iniciar sesión")).toBe(
            "No se pudo iniciar sesión. Demasiados intentos. Esperá un momento y probá de nuevo."
        )
    })

    it("oculta mensajes técnicos de validación", () => {
        const error = new ApiError(400, "Too small: expected string to have >=1 characters", "BAD_REQUEST")
        expect(userFacingError(error, "No se pudo crear el club")).toBe("No se pudo crear el club.")
    })
})
