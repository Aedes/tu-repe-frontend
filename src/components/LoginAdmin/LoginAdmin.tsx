import "./LoginAdmin.css"
import Button from "../common/Button/Button";
import NavBar from "../common/NavBar/NavBar";
import { useFetchData } from "../../hooks/useFetchData";
import { BACKEND_API_URL } from "../../config";
import { useState } from "react";
import { toast } from "sonner";

const LoginAdmin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { isLoading, fetchData } = useFetchData<{ token: string }>("POST");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error("Por favor, complete todos los campos.");
            return;
        }
        const response = await fetchData(`${BACKEND_API_URL}/auth/admin/login`, { email, password });

        if (!response) {
            toast.error("Credenciales inválidas. Por favor, intente nuevamente.");
            return;
        }

        localStorage.setItem("access_token", response.token);
        window.location.href = "/admin";
    }

    return (
        <div className="loginAdminContainer">
            <NavBar context="club" />
            <div className="loginAdminPanel">
                <h2 className="loginAdminTitle">Panel de Administrador</h2>
                <form className="loginAdminForm" onSubmit={handleSubmit}>
                    <div className="loginAdminField">
                        <label htmlFor="email">
                            Correo electrónico
                        </label>
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
                        <label htmlFor="password">
                            Contraseña
                        </label>
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
