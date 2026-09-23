import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../../config";

interface Props {
    children: React.ReactNode
}

const AdminRoute: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate()
    const { fetchData } = useFetchData<{ isAdmin: boolean }>("GET")
    const [status, setStatus] = useState<"checking" | "authorized" | "denied">("checking")

    useEffect(() => {
        let active = true
        const checkAdmin = async () => {
            const response = await fetchData(`${BACKEND_API_URL}/auth/admin/check-admin`)
            if (!active) return
            if (!response) {
                setStatus("denied")
                navigate("/login-admin", { replace: true })
                return
            }
            setStatus("authorized")
        }
        void checkAdmin()
        return () => {
            active = false
        }
    }, [])

    if (status !== "authorized") {
        return (
            <div className="adminRouteLoading" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Verificando credenciales...</h2>
            </div>
        )
    }

    return <>{children}</>
}

export default AdminRoute;
