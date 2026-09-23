import { useEffect, useRef } from "react"
import { TURNSTILE_SITE_KEY } from "../../../config"

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: Record<string, unknown>) => string
            reset: (id?: string) => void
            remove: (id: string) => void
        }
    }
}

type Props = {
    onToken: (token: string) => void
}

const TurnstileWidget = ({ onToken }: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const widgetId = useRef<string | null>(null)

    useEffect(() => {
        const el = ref.current
        if (!el || !window.turnstile) return
        widgetId.current = window.turnstile.render(el, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token: string) => onToken(token),
            "expired-callback": () => onToken(""),
            "error-callback": () => onToken(""),
        })
        return () => {
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current)
            }
        }
    }, [onToken])

    return <div ref={ref} />
}

export default TurnstileWidget
