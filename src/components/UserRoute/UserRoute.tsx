import "./UserRoute.css"
import { BACKEND_API_URL } from "../../config";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/userStore";
import type { IUser } from "../../types";

interface Props {
    children: React.ReactNode
}

const UserRoute: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate()
    const { fetchData } = useFetchData<{ isAdmin: boolean, user: Omit<IUser, "passwordHash"> }>("GET")
    const { setUser } = useUserStore()
    const [status, setStatus] = useState<"checking" | "authorized" | "denied">("checking")

    useEffect(() => {
        let active = true
        const checkUser = async () => {
            const response = await fetchData(`${BACKEND_API_URL}/auth/user/check-user`)
            if (!active) return
            if (!response) {
                setStatus("denied")
                navigate("/login-user", { replace: true })
                return
            }
            setUser(response.user)
            setStatus("authorized")
        }
        void checkUser()
        return () => {
            active = false
        }
    }, [])

    if (status !== "authorized") {
        return (
            <div className="adminRouteLoading" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                <h2>Verificando credenciales...</h2>
            </div>
        )
    }

    return <>{children}</>
}

export default UserRoute;
