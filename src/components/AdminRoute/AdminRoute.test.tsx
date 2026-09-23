import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import AdminRoute from "./AdminRoute"

vi.mock("../../hooks/useFetchData", () => ({
    useFetchData: () => ({
        fetchData: vi.fn().mockResolvedValue(null),
        isLoading: false,
        error: null,
    }),
}))

describe("AdminRoute", () => {
    it("no muestra el panel mientras verifica", async () => {
        render(
            <MemoryRouter>
                <AdminRoute>
                    <div>panel-secreto</div>
                </AdminRoute>
            </MemoryRouter>
        )
        expect(screen.queryByText("panel-secreto")).not.toBeInTheDocument()
        expect(screen.getByText(/Verificando credenciales/i)).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.queryByText("panel-secreto")).not.toBeInTheDocument()
        })
    })
})
