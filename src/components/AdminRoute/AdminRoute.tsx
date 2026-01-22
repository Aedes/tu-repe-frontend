import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { useEffect } from "react";
import { BACKEND_API_URL } from "../../config";

interface Props {
    children: React.ReactNode
}

const AdminRoute: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem("access_token")
    const { isLoading, fetchData } = useFetchData<{ isAdmin: boolean }>(`${BACKEND_API_URL}/auth/admin/check-admin`, "GET", token)

    useEffect(() => {
        const checkAdmin = async () => {
            const response = await fetchData()
            if (!response.isAdmin) {
                navigate("/login-admin")
            }
        }
        checkAdmin()
    }, [])

    return (
        <>
            {
                isLoading ?
                    <div className="adminRouteLoading"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            flexDirection: 'column'
                        }}
                    >
                        <h2>Verificando credenciales...</h2>
                    </div>
                    :
                    children
            }
        </>
    )
}

export default AdminRoute;
