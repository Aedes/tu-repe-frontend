import "./LoginAdmin.css"
import Button from "../common/Button/Button";
import NavBar from "../common/NavBar/NavBar";
import { useFetchData } from "../../hooks/useFetchData";
import { BACKEND_API_URL } from "../../config";
import { useState } from "react";
import { toast } from "sonner";
import { userFacingError } from "../../api/errorMessage";

const LoginAdmin = ({ baseUrl }: { baseUrl: "admin" | "user" }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [totp, setTotp] = useState("")
    const { isLoading, fetchData, lastErrorRef } = useFetchData<{ id: string }>("POST");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email || !password || (baseUrl === "admin" && !totp)) {
            toast.error("Por favor, complete todos los campos.");
            return;
        }
        const body = baseUrl === "admin" ? { email, password, totp } : { email, password }
        const response = await fetchData(`${BACKEND_API_URL}/auth/${baseUrl}/login`, body);

        if (!response) {
            toast.error(userFacingError(lastErrorRef.current, "No se pudo iniciar sesión"));
            return;
        }

        window.location.replace(`/${baseUrl}`);
    }

    return (
        <div className="loginAdminContainer">
            <NavBar context="club" />
            <div className="loginAdminPanel">
                <h2 className="loginAdminTitle">Panel de {baseUrl === "admin" ? "administrador" : "usuario"}</h2>
                <form className="loginAdminForm" onSubmit={handleSubmit}>
                    <div className="loginAdminField">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="admin@email.com"
                            required
                            className="loginAdminInput"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="loginAdminField">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            required
                            className="loginAdminInput"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {baseUrl === "admin" && (
                        <div className="loginAdminField">
                            <label htmlFor="totp">Código MFA</label>
                            <input
                                type="text"
                                id="totp"
                                name="totp"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="000000"
                                required
                                className="loginAdminInput"
                                onChange={(e) => setTotp(e.target.value)}
                            />
                        </div>
                    )}
                    <Button
                        width="100%"
                        margin="0"
                        backgroundColor="#0077b6"
                        color="white"
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoginAdmin;
