import "./AdminInterface.css"
import NavBar from "../../common/NavBar/NavBar";
import StatCard from "./StatCard/StatCard";
import { CameraIcon, CompanyIcon } from "../../../assets/Icons";
import centerLogo from "../../../assets/tmp/center-logo.jpeg"
import Button from "../../common/Button/Button";
import { useEffect, useState } from "react";
import { useFetchData } from "../../../hooks/useFetchData";
import type { ClubWithCourts, IClub } from "../../../types";
import { BACKEND_API_URL } from "../../../config";
import { toast } from "sonner";
import ModalForm from "../../common/ModalForm/ModalForm";
import Modal from "../../common/Modal/Modal";

const AdminInterface = () => {
    const token = localStorage.getItem("access_token")
    const { isLoading: isLoadingPostClub, error: errorPostClub, fetchData: fetchDataPostClub } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs`, "POST", token)
    const { isLoading: isLoadingClubs, error: errorClubs, fetchData: fetchDataClubs } = useFetchData<ClubWithCourts[]>(`${BACKEND_API_URL}/clubs/with-courts`, "GET")
    const [clubs, setClubs] = useState<ClubWithCourts[]>([])
    const [isOpenForm, setIsOpenForm] = useState(false)
    const [isOpenClubDetails, setIsOpenClubDetails] = useState(false)
    const [clubSelected, setClubSelected] = useState<ClubWithCourts | null>(null)

    if (errorPostClub) {
        console.error("Error creating club:", errorPostClub)
        toast.error("Error al crear el club. Por favor, intente nuevamente.")
    }

    if (errorClubs) {
        console.error("Error fetching clubs:", errorClubs)
        toast.error("Error al cargar los clubes. Por favor, intente nuevamente.")
    }

    useEffect(() => {
        const fetchClubsAndCourts = async () => {
            const clubsData = await fetchDataClubs()
            setClubs(clubsData)
        }
        fetchClubsAndCourts()
    }, [])

    const handleCreateClub = async (data: { [key: string]: any }) => {
        const newClub = await fetchDataPostClub(data)
        if (newClub) {
            setClubs(prevClubs => [...prevClubs, { ...newClub, courts: [] }])
            toast.success("Club creado exitosamente.")
        }
        setIsOpenForm(false)
    }

    return (
        <div className="adminInterfaceContainer">
            <NavBar context="club" />
            <div className="adminInterfacePanel">
                <div className="adminInterfaceTitle">
                    <div>
                        <h1>Hola, Aedes</h1>
                        <p>Bienvenido al panel de administración de Tu Repe</p>
                    </div>
                    <Button
                        margin="0"
                        onClick={() => setIsOpenForm(true)}
                        backgroundColor="rgb(0, 173, 0)"
                        color="white"
                        disabled={isLoadingClubs}
                    >
                        + Nuevo Club
                    </Button>
                </div>
                {
                    isLoadingClubs ?
                        <div className="loadingClubsStatsContainer">
                            <p>Cargando clubes y estadísticas...</p>
                        </div>
                        :
                        <>
                            <div className="adminInterfaceStats">
                                <StatCard
                                    icon={<CompanyIcon
                                        width={30}
                                        height={30}
                                        fill="#0077b6"
                                    />}
                                    title="Clubes"
                                    quantity={clubs.length}
                                />
                                <StatCard
                                    icon={<CameraIcon
                                        width={30}
                                        height={30}
                                        fill="#0077b6"
                                    />}
                                    title="Canchas"
                                    quantity={clubs.reduce((acc, club) => acc + club.courts.length, 0)}
                                />
                            </div>
                            <div className="listOfClubsTableContainer">
                                <h2 className="listOfClubsTitle">Lista de Clubes</h2>
                                <table className="listOfClubsTable">
                                    <thead>
                                        <tr>
                                            <th>Club</th>
                                            <th>Ubicación</th>
                                            <th>Número de Canchas</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            clubs.map(c => (
                                                <tr key={c.id}>
                                                    <td className="clubNameCell">
                                                        <img className="logoClubTable" src={centerLogo} alt="Logo del club" />
                                                        {c.name}
                                                    </td>
                                                    <td>Mendoza, Argentina</td>
                                                    <td>{c.courts.length}</td>
                                                    <td>
                                                        <button
                                                            className="viewDetailsButton"
                                                            onClick={() => {
                                                                setClubSelected(c)
                                                                setIsOpenClubDetails(true)
                                                            }}
                                                        >
                                                            Ver Detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </>
                }
            </div>
            <ModalForm
                isOpen={isOpenForm}
                inputs={[
                    { label: "Nombre del club", type: "text", name: "name", placeholder: "Aedes Sports", required: true },
                    { label: "Horario de apertura", type: "text", name: "openTime", placeholder: "HH:mm", required: true },
                    { label: "Horario de cierre", type: "text", name: "closeTime", placeholder: "HH:mm", required: true },
                    { label: "Duración de los turnos (en minutos)", type: "number", name: "appointmentDuration", placeholder: "90", required: true },
                    { label: "País", type: "text", name: "country", placeholder: "Argentina", required: true },
                    { label: "Provincia", type: "text", name: "province", placeholder: "Mendoza", required: true },
                    { label: "Ciudad", type: "text", name: "city", placeholder: "San Rafael", required: true },
                    { label: "Dirección", type: "text", name: "address", placeholder: "Calle 123", required: true },
                    { label: "Teléfono del club", type: "text", name: "phone", placeholder: "1234567890" },
                    { label: "Instagram del club", type: "text", name: "instagramHandle", placeholder: "aedes.tech" },
                    { label: "Descripción (hasta 200 caracteres)", type: "textarea", name: "description", placeholder: "Pequeña descripción del club..." },
                ]}
                title="Agregar nuevo Club"
                subtitle="Los campos con * son obligatorios."
                initialData={{}}
                onSubmitForm={(data) => handleCreateClub(data)}
                onClose={() => setIsOpenForm(false)}
                disabledButtons={isLoadingPostClub}
            />
            <Modal isOpen={isOpenClubDetails}>
                {clubSelected && (
                    <div className="clubDetailsContainer">
                        <h2 className="clubDetailsTitle">{clubSelected.name}</h2>
                        <p><strong>Ubicación:</strong> Mendoza, Argentina</p>
                        <p><strong>Número de Canchas:</strong> {clubSelected.courts.length}</p>
                        <h3 className="clubDetailsCourtsTitle">Canchas:</h3>
                        <ul className="clubDetailsCourtsList">
                            {clubSelected.courts.map(court => (
                                <li key={court.id} className="clubDetailsCourtItem">
                                    <p><strong>Nombre de la cancha:</strong> {court.name}</p>
                                </li>
                            ))}
                        </ul>
                        <Button
                            margin="20px 0 0 0"
                            onClick={() => setIsOpenClubDetails(false)}
                            backgroundColor="#0077b6"
                            color="white"
                        >
                            Cerrar
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default AdminInterface;
