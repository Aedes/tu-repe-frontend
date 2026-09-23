import { ApiError } from "./http"

const translations: Record<string, string> = {
    "A user with that email already exists.": "Ya existe un usuario con ese email",
    "Court not found": "No encontramos esa cancha",
    "Club not found": "No encontramos ese club",
    "User not found": "No encontramos ese usuario",
    "Video not found": "No encontramos ese video",
    "No file uploaded": "No se envió ningún archivo",
    "Overlapping videos found": "Ya hay un video cargado en ese horario",
    "Overlapping videos found for the given court and time range": "Ya hay un video cargado en ese horario",
    "Invalid Stream Key": "La clave de la cámara no es válida",
    "No autorizado": "Tu sesión venció. Volvé a iniciar sesión",
    "Token inválido": "Tu sesión no es válida. Volvé a iniciar sesión",
    "Credenciales inválidas": "Email, contraseña o código incorrectos",
    "Acceso denegado": "No tenés permiso para hacer eso",
    "Verificación anti-bot fallida": "El CAPTCHA no se pudo verificar. Volvé a completarlo",
    "CSRF inválido": "La página quedó desactualizada. Recargá e intentá de nuevo",
    "Origen no permitido": "La página quedó desactualizada. Recargá e intentá de nuevo",
    "Datos inválidos": "Hay datos inválidos. Revisá los campos",
    "Parámetros inválidos": "Hay datos inválidos. Revisá los campos",
    "Identificador inválido": "No encontramos ese elemento",
    "La imagen no es válida": "La imagen no es válida. Usá JPG, PNG o WebP",
    "Archivo demasiado grande": "El archivo es demasiado grande",
    "Upload inválido": "No se pudo subir el archivo",
    "Demasiadas solicitudes": "Demasiados intentos. Esperá un momento y probá de nuevo",
    "Cola de conversión llena": "Hay muchos clips en proceso. Probá de nuevo en un minuto",
    "El clip no es WebM": "El clip tiene un formato que no podemos convertir",
    "El clip supera los 30 segundos": "El clip no puede durar más de 30 segundos",
    "El clip no contiene video": "El clip no contiene video",
    "Resolución de clip no permitida": "La resolución del clip no está permitida",
    "FPS de clip no permitidos": "La velocidad de fotogramas del clip no está permitida",
    "Timeout al convertir clip": "La conversión tardó demasiado. Probá con un clip más corto",
    "Archivo no enviado": "No se envió el clip",
    "El horario está fuera de la ventana disponible": "Ese horario ya no está disponible. Solo se pueden ver partidos de las últimas 72 horas",
    "La preparación tardó demasiado": "La preparación del video tardó demasiado. Probá de nuevo",
    "No encontramos esa búsqueda": "No encontramos esa búsqueda. Volvé a intentar",
    "No hay campos para actualizar": "No hay cambios para guardar",
    "Error interno": "Hubo un problema en el servidor. Probá de nuevo en unos minutos",
    "Ruta no encontrada": "No encontramos lo que buscabas",
    "Servicio no disponible": "El servicio no está disponible en este momento",
    "Error asignando dueño": "No se pudo asignar el dueño. Revisá que el usuario y el club existan",
    "Error desasignando dueño": "No se pudo quitar el dueño de ese club",
    "Error obteniendo usuario": "No encontramos ese usuario",
    "Acción no soportada": "Esa acción no está disponible",
}

const technical = /expected|invalid input|invalid (email|uuid|string)|too small|too big|unrecognized key|received |string must contain|^error:\s*\d+/i

const join = (action: string, reason: string) => {
    const base = action.replace(/\.+$/, "")
    const detail = reason.replace(/\.+$/, "")
    if (!detail || base.toLowerCase() === detail.toLowerCase()) return `${base}.`
    return `${base}. ${detail}.`
}

export const userFacingError = (error: unknown, action: string) => {
    const status = error instanceof ApiError ? error.status : undefined
    const code = error instanceof ApiError ? error.code : undefined
    const raw = error instanceof Error ? error.message.trim() : ""

    if (status === 429 || code === "RATE_LIMITED") {
        return join(action, "Demasiados intentos. Esperá un momento y probá de nuevo")
    }

    const translated = translations[raw]
    if (translated) return join(action, translated)

    if (status === 401 || code === "UNAUTHORIZED") {
        return join(action, "Tu sesión venció. Volvé a iniciar sesión")
    }
    if (status === 403 || code === "FORBIDDEN") {
        return join(action, "No tenés permiso para hacer eso")
    }
    if (status !== undefined && status >= 500) {
        return join(action, "Hubo un problema en el servidor. Probá de nuevo en unos minutos")
    }

    if (raw && !technical.test(raw)) return join(action, raw)
    return `${action.replace(/\.+$/, "")}.`
}
