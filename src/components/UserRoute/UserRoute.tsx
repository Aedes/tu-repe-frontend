import "./UserRoute.css"
import { BACKEND_API_URL } from "../../config";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import type { IUser } from "../../types";

interface Props {
    children: React.ReactNode
}

const UserRoute: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem("access_token_user")
    const { isLoading, fetchData } = useFetchData<{ isAdmin: boolean, user: Omit<IUser, "passwordHash"> }>("GET", token)

    const { setUser } = useUserStore()

    useEffect(() => {
        const checkUser = async () => {
            const response = await fetchData(`${BACKEND_API_URL}/auth/user/check-user`)
            if (!response) {
                navigate(`/login-user`)
            }

            setUser(response.user)
        }
        checkUser()
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
    );
}

export default UserRoute;
