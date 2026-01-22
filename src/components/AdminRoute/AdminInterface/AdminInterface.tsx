import "./AdminInterface.css"
import NavBar from "../../common/NavBar/NavBar";
import StatCard from "./StatCard/StatCard";
import { CameraIcon, CompanyIcon, ImageIcon } from "../../../assets/Icons";
import Button from "../../common/Button/Button";
import { useEffect, useState } from "react";
import { useFetchData } from "../../../hooks/useFetchData";
import type { ClubWithCourts, IClub } from "../../../types";
import { BACKEND_API_URL, DEFAUL_COVER_IMAGE_URL, DEFAUL_PROFILE_IMAGE_URL } from "../../../config";
import { toast } from "sonner";
import ModalForm from "../../common/ModalForm/ModalForm";
import Modal from "../../common/Modal/Modal";
import ModalLoading from "../../common/ModalLoading/ModalLoading";

const AdminInterface = () => {
    const token = localStorage.getItem("access_token")
    const { isLoading: isLoadingPostClub, error: errorPostClub, fetchData: fetchDataPostClub } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs`, "POST", token)
    const { isLoading: isLoadingClubs, error: errorClubs, fetchData: fetchDataClubs } = useFetchData<ClubWithCourts[]>(`${BACKEND_API_URL}/clubs/with-courts`, "GET")
    const [clubs, setClubs] = useState<ClubWithCourts[]>([])
    const [isOpenForm, setIsOpenForm] = useState(false)
    const [isOpenClubDetails, setIsOpenClubDetails] = useState(false)
    const [clubSelected, setClubSelected] = useState<ClubWithCourts | null>(null)
    const { isLoading: isLoadingUploadLogo, error: _errorUploadLogo, fetchData: fetchDataUploadLogo } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubSelected?.id}/logo`, "PUT", token)
    const { isLoading: isLoadingUploadCover, error: _errorUploadCover, fetchData: fetchDataUploadCover } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubSelected?.id}/cover`, "PUT", token)
    const { isLoading: isLoadingDeleteLogo, error: _errorDeleteLogo, fetchData: fetchDataDeleteLogo } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubSelected?.id}/logo`, "DELETE", token)
    const { isLoading: isLoadingDeleteCover, error: _errorDeleteCover, fetchData: fetchDataDeleteCover } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubSelected?.id}/cover`, "DELETE", token)
    const [newData, setNewData] = useState<IClub | null>(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isLoading: isLoadingUpdateClub, error: _errorUpdateClub, fetchData: fetchDataUpdateClub } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubSelected?.id}`, "PUT", token)

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

    useEffect(() => {
        const checkData = () => {
            if (JSON.stringify(clubSelected) === JSON.stringify(newData)) {
                setIsDisabled(true)
                return
            }
            setIsDisabled(false)
        }
        checkData()
    }, [newData])

    const handleCreateClub = async (data: { [key: string]: any }) => {
        const newClub = await fetchDataPostClub(data)
        if (newClub) {
            setClubs(prevClubs => [...prevClubs, { ...newClub, courts: [] }])
            toast.success("Club creado exitosamente.")
        }
        setIsOpenForm(false)
    }

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchDataUploadLogo(formData)
        if (response) {
            setClubSelected(prevClub => prevClub ? { ...prevClub, profileImageUrl: response.profileImageUrl, profileImagePublicId: response.profileImagePublicId } : null)
            toast.success("Imagen subida exitosamente.")
            return
        }

        toast.error("Error al subir el logo. Por favor, intente nuevamente.")
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchDataUploadCover(formData)
        if (response) {
            setClubSelected(prevClub => prevClub ? { ...prevClub, coverImageUrl: response.coverImageUrl, coverImagePublicId: response.coverImagePublicId } : null)
            toast.success("Imagen subida exitosamente.")
            return
        }

        toast.error("Error al subir el logo. Por favor, intente nuevamente.")
    };

    const handleDeleteLogo = async () => {
        console.log("Eliminando Logo...")
        const response = await fetchDataDeleteLogo()
        if (response) {
            setClubSelected(prevClub => prevClub ? { ...prevClub, profileImageUrl: undefined, profileImagePublicId: undefined } : null)
            toast.success("Imagen eliminada exitosamente.")
            return
        }

        toast.error("Error al eliminar el logo. Por favor, intente nuevamente.")
    }

    const handleDeleteCover = async () => {
        console.log("Eliminando Cover...")
        const response = await fetchDataDeleteCover()
        if (response) {
            setClubSelected(prevClub => prevClub ? { ...prevClub, coverImageUrl: undefined, coverImagePublicId: undefined } : null)
            toast.success("Imagen eliminada exitosamente.")
            return
        }

        toast.error("Error al eliminar la portada. Por favor, intente nuevamente.")
    }

    const handleUpdateClub = async () => {
        if (!newData) return
        const response = await fetchDataUpdateClub(newData)
        if (response) {
            setClubSelected(prevClub => prevClub ? { ...prevClub, ...response } : null)
            setNewData(prevClub => prevClub ? { ...prevClub, ...response } : null)
            setClubs(prevClubs => prevClubs.map(c => c.id === response.id ? { ...c, ...response } : c))
            toast.success("Club actualizado exitosamente.")
            return
        }
        toast.error("Error al actualizar el club. Por favor, intente nuevamente.")
    }

    return (
        <div className="adminInterfaceContainer">
            <NavBar context="club" />
            <div className="adminInterfacePanel">
                <div className="adminInterfaceTitle">
                    <div>
                        <h1>Hola, Aedes 👋</h1>
                        <p>Bienvenido al panel de administración de Tu Repe</p>
                    </div>
                    <Button
                        margin="0"
                        onClick={() => setIsOpenForm(true)}
                        fontSize={window.innerWidth < 650 ? "0.9rem" : "1rem"}
                        padding={window.innerWidth < 650 ? "0.5rem 1rem" : ""}
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
                                        width={window.innerWidth < 650 ? 24 : 30}
                                        height={window.innerWidth < 650 ? 24 : 30}
                                        fill="#0077b6"
                                    />}
                                    title="Clubes"
                                    quantity={clubs.length}
                                />
                                <StatCard
                                    icon={<CameraIcon
                                        width={window.innerWidth < 650 ? 24 : 30}
                                        height={window.innerWidth < 650 ? 24 : 30}
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
                                            clubs.map(c => {
                                                return <tr key={c.id}>
                                                    <td className="clubNameCell">
                                                        <img className="logoClubTable" src={c.profileImageUrl ? c.profileImageUrl : DEFAUL_PROFILE_IMAGE_URL} alt="Logo del club" />
                                                        {c.name}
                                                    </td>
                                                    <td className="clubLocationCell">
                                                        <p className="city">{c.city}, {c.province}</p>
                                                        <p className="address">{c.address}</p>
                                                    </td>
                                                    <td>{c.courts.length}</td>
                                                    <td>
                                                        <button
                                                            className="viewDetailsButton"
                                                            onClick={() => {
                                                                setClubSelected(c)
                                                                setNewData(c)
                                                                setIsOpenClubDetails(true)
                                                            }}
                                                        >
                                                            Ver Detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            }
                                            )
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
                {(clubSelected && newData) && (
                    <div className="clubDetailsContainer">
                        <h2 className="clubDetailsTitle">Editar club</h2>
                        <div className="clubDetails">
                            <div className="coverImageContainer">
                                <h3>Foto de portada</h3>
                                <div className="coverImageWrapper"
                                    style={{
                                        backgroundImage: clubSelected?.coverImageUrl
                                            ? `url(${clubSelected.coverImageUrl})`
                                            : `url("${DEFAUL_COVER_IMAGE_URL}")`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat"
                                    }}
                                />
                                <div className="buttonsCoverImageContainer">
                                    <p className="pCoverImageContainer">La imagen se centrará automáticamente, recomendamos que lo que se quiera mostrar esté un poco más arriba del centro.</p>
                                    <div className="buttonsCoverImageInnerContainer">
                                        {
                                            clubSelected.coverImageUrl &&
                                            <Button
                                                width={window.innerWidth < 510 ? "100%" : "auto"} margin="0"
                                                padding=".5rem 1rem"
                                                color="white"
                                                backgroundColor="rgb(221, 76, 76)"
                                                onClick={handleDeleteCover}
                                            >
                                                Eliminar
                                            </Button>
                                        }
                                        <label className="customFileUpload">
                                            <ImageIcon
                                                width={20}
                                                height={20}
                                                fill="black"
                                            />
                                            Cambiar portada
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverChange}
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="profileImageContainer">
                                <h3>Foto de perfil / Logo</h3>
                                <div className="profileImageInnerContainer">
                                    <div className="profileImageWrapper">
                                        <img
                                            src={clubSelected.profileImageUrl ? clubSelected.profileImageUrl : DEFAUL_PROFILE_IMAGE_URL}
                                            alt="Logo del club"
                                            className="profileImage"
                                        />
                                    </div>
                                    <div className="buttonsProfileImageContainer">
                                        <p className="pProfilaImageContainer">Recomandación: 400x400px. El logo debe posicionarse en el medio de la foto</p>
                                        <div className="buttonsProfileImageInnerContainer">
                                            {
                                                clubSelected.profileImageUrl &&
                                                <Button
                                                    width={window.innerWidth < 510 ? "100%" : "auto"}
                                                    margin="0"
                                                    padding=".5rem 1rem"
                                                    color="white"
                                                    backgroundColor="rgb(221, 76, 76)"
                                                    onClick={handleDeleteLogo}
                                                >
                                                    Eliminar
                                                </Button>
                                            }
                                            <label className="customFileUpload">
                                                <ImageIcon
                                                    width={20}
                                                    height={20}
                                                    fill="black"
                                                />
                                                Cambiar logo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    style={{ display: "none" }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="clubInfoContainer">
                                <div className="divInputClubInfo">
                                    <label>Nombre del club:</label>
                                    <input
                                        type="text"
                                        value={newData.name}
                                        onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                                    />
                                </div>
                                <div className="divInputClubInfoRow">
                                    <div className="divInputClubInfo">
                                        <label>Horario de apertura:</label>
                                        <input
                                            type="text"
                                            value={`${newData.openTime.split(":")[0]}:${newData.openTime.split(":")[1]}`}
                                            onChange={(e) => setNewData({ ...newData, openTime: `${e.target.value}:00` })}
                                        />
                                    </div>
                                    <div className="divInputClubInfo">
                                        <label>Horario de cierre:</label>
                                        <input
                                            type="text"
                                            value={`${newData.closeTime.split(":")[0]}:${newData.closeTime.split(":")[1]}`}
                                            onChange={(e) => setNewData({ ...newData, closeTime: `${e.target.value}:00` })}
                                        />
                                    </div>
                                </div>
                                <div className="divInputClubInfo">
                                    <label>Duración de los turnos (en minutos): </label>
                                    <input
                                        type="number"
                                        value={newData.appointmentDuration}
                                        onChange={(e) => setNewData({ ...newData, appointmentDuration: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="divInputClubInfoRow">
                                    <div className="divInputClubInfo">
                                        <label>País:</label>
                                        <input
                                            type="text"
                                            value={newData.country}
                                            onChange={(e) => setNewData({ ...newData, country: e.target.value })}
                                        />
                                    </div>
                                    <div className="divInputClubInfo">
                                        <label>Provincia:</label>
                                        <input
                                            type="text"
                                            value={newData.province}
                                            onChange={(e) => setNewData({ ...newData, province: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="divInputClubInfoRow">
                                    <div className="divInputClubInfo">
                                        <label>Cuidad:</label>
                                        <input
                                            type="text"
                                            value={newData.city}
                                            onChange={(e) => setNewData({ ...newData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="divInputClubInfo">
                                        <label>Dirección:</label>
                                        <input
                                            type="text"
                                            value={newData.address}
                                            onChange={(e) => setNewData({ ...newData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="divInputClubInfo">
                                    <label>Descripción:</label>
                                    <textarea
                                        value={newData.description}
                                        onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                                    />
                                </div>
                                <div className="divInputClubInfoRow">
                                    <div className="divInputClubInfo">
                                        <label>Teléfono del club:</label>
                                        <input
                                            type="text"
                                            value={newData.phone}
                                            onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="divInputClubInfo">
                                        <label>Instagram del club:</label>
                                        <input
                                            type="text"
                                            value={newData.instagramHandle}
                                            onChange={(e) => setNewData({ ...newData, instagramHandle: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="clubDetailsActions">
                                <Button
                                    width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                                    margin="0"
                                    onClick={() => setIsOpenClubDetails(false)}
                                    backgroundColor="grey"
                                    color="white"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                                    margin="0"
                                    onClick={handleUpdateClub}
                                    backgroundColor="rgb(0, 173, 0)"
                                    color="white"
                                    disabled={isDisabled}
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            <ModalLoading
                text={(isLoadingUploadLogo || isLoadingUploadCover || isLoadingDeleteLogo || isLoadingDeleteCover) ? "Acualizando imágen..." : "Cargando..."}
                isOpen={
                    isLoadingUploadLogo ||
                    isLoadingUploadCover ||
                    isLoadingDeleteLogo ||
                    isLoadingUpdateClub ||
                    isLoadingDeleteCover
                }
            />
        </div>
    );
}

export default AdminInterface;
