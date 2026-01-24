import "./AdminInterface.css"
import NavBar from "../../common/NavBar/NavBar";
import StatCard from "./StatCard/StatCard";
import { CameraIcon, CompanyIcon, ImageIcon, PlusIcon, PencilIcon } from "../../../assets/Icons";
import Button from "../../common/Button/Button";
import { useEffect, useState } from "react";
import { useFetchData } from "../../../hooks/useFetchData";
import type { ClubWithCourts, IClub, ICourt } from "../../../types";
import { BACKEND_API_URL, DEFAULT_COVER_IMAGE_URL, DEFAULT_PROFILE_IMAGE_URL } from "../../../config";
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
    const [isOpenCourtForm, setIsOpenCourtForm] = useState(false)
    const [courtToEdit, setCourtToEdit] = useState<ICourt | null>(null)
    const [courts, setCourts] = useState<ICourt[]>([])
    const [courtFormData, setCourtFormData] = useState<Partial<ICourt & { rtspPassword: string }>>({
        name: "",
        cameraHost: "",
        cameraPort: 0,
        cameraPath: "",
        rtspUsername: "",
        rtspPassword: ""
    })
    const { isLoading: isLoadingPostCourt, error: _errorPostCourt, fetchData: fetchDataPostCourt } = useFetchData<ICourt>(`${BACKEND_API_URL}/courts`, "POST", token)
    const { isLoading: isLoadingUpdateCourt, error: _errorUpdateCourt, fetchData: fetchDataUpdateCourt } = useFetchData<ICourt>(`${BACKEND_API_URL}/courts/c/${courtToEdit?.id}/admin`, "PUT", token)
    const [courtToDelete, setCourtToDelete] = useState<ICourt | null>(null)
    const { isLoading: isLoadingDeleteCourt, error: _errorDeleteCourt, fetchData: fetchDataDeleteCourt } = useFetchData<ICourt>(`${BACKEND_API_URL}/courts/c/${courtToDelete?.id}`, "DELETE", token)
    const { isLoading: isLoadingDeleteClub, error: _errorDeleteClub, fetchData: fetchDataDeleteClub } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubSelected?.id}`, "DELETE", token)

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

    useEffect(() => {
        if (clubSelected) {
            setCourts(clubSelected.courts || [])
        }
    }, [clubSelected])

    useEffect(() => {
        if (courtToDelete) {
            handleDeleteCourt()
        }
    }, [courtToDelete])

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
            setNewData(prevClub => prevClub ? { ...prevClub, ...response } : null)
            setClubs(prevClubs => prevClubs.map(c => c.id === response.id ? { ...c, ...response } : c))
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
            setNewData(prevClub => prevClub ? { ...prevClub, ...response } : null)
            setClubs(prevClubs => prevClubs.map(c => c.id === response.id ? { ...c, ...response } : c))
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
            setNewData(prevClub => prevClub ? { ...prevClub, ...response } : null)
            setClubs(prevClubs => prevClubs.map(c => c.id === response.id ? { ...c, ...response } : c))
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
            setNewData(prevClub => prevClub ? { ...prevClub, ...response } : null)
            setClubs(prevClubs => prevClubs.map(c => c.id === response.id ? { ...c, ...response } : c))
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

    const handleOpenCourtForm = (court?: ICourt) => {
        if (court) {
            setCourtToEdit(court)
            setCourtFormData({
                name: court.name,
                cameraHost: court.cameraHost,
                cameraPort: court.cameraPort,
                cameraPath: court.cameraPath,
                rtspUsername: court.rtspUsername
            })
        } else {
            setCourtToEdit(null)
            setCourtFormData({
                name: "",
                cameraHost: "",
                cameraPort: 0,
                cameraPath: "",
                rtspUsername: ""
            })
        }
        setIsOpenCourtForm(true)
    }

    const handleCloseCourtForm = () => {
        setIsOpenCourtForm(false)
        setCourtToEdit(null)
        setCourtFormData({
            name: "",
            cameraHost: "",
            cameraPort: 0,
            cameraPath: "",
            rtspUsername: ""
        })
    }

    const handleSubmitCourtForm = async () => {
        if (!clubSelected) return

        if (courtToEdit) {
            const response = await fetchDataUpdateCourt(courtFormData)
            if (!response) {
                toast.error("No se pudo editar la cancha, intente nuevamente.")
                return
            }
            const updatedCourts = courts.map(c => c.id === courtToEdit.id ? response : c)
            setCourts(updatedCourts)
            if (clubSelected) {
                setClubs(prevClubs => prevClubs.map(c => c.id === clubSelected.id ? { ...c, courts: updatedCourts } : c))
                setClubSelected({ ...clubSelected, courts: updatedCourts })
                setNewData(prevData => prevData ? { ...prevData, courts: updatedCourts } as IClub : null)
            }
            toast.success("Cancha editada correctamente.")

        } else {
            const response = await fetchDataPostCourt({ ...courtFormData, clubId: clubSelected.id })
            if (!response) {
                toast.error("No se pudo crear la cancha, intente nuevamente.")
                return
            }
            const updatedCourts = [...courts, response]
            setCourts(updatedCourts)
            if (clubSelected) {
                setClubs(prevClubs => prevClubs.map(c => c.id === clubSelected.id ? { ...c, courts: updatedCourts } : c))
                setClubSelected({ ...clubSelected, courts: updatedCourts })
                setNewData(prevData => prevData ? { ...prevData, courts: updatedCourts } as IClub : null)
            }
            toast.success("Cancha agregada correctamente.")
        }

        handleCloseCourtForm()
    }

    const handleDeleteCourt = async () => {
        const response = await fetchDataDeleteCourt()
        if (!response) {
            toast.error("No se pudo eliminar la cancha, intente nuevamente.")
            return
        }
        setCourts(prevCourts => prevCourts.filter(c => c.id !== courtToDelete?.id))
        if (clubSelected) {
            const updatedCourts = clubSelected.courts.filter(c => c.id !== courtToDelete?.id)
            setClubs(prevClubs => prevClubs.map(c => c.id === clubSelected.id ? { ...c, courts: updatedCourts } : c))
            setClubSelected({ ...clubSelected, courts: updatedCourts })
            setNewData(prevData => prevData ? { ...prevData, courts: updatedCourts } as IClub : null)
        }
        toast.success("Cancha eliminada correctamente.")
        setCourtToDelete(null)
    }

    const handleDeleteClub = async () => {
        const response = await fetchDataDeleteClub()
        if (!response) {
            toast.error("No se pudo eliminar el club, intente nuevamente.")
            return
        }
        setClubs(prevClubs => prevClubs.filter(c => c.id !== clubSelected?.id))
        toast.success("Club eliminado correctamente.")
        setIsOpenClubDetails(false)
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
                                                        <img className="logoClubTable" src={c.profileImageUrl ? c.profileImageUrl : DEFAULT_PROFILE_IMAGE_URL} alt="Logo del club" />
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
            <Modal isOpen={isOpenClubDetails} setIsOpen={setIsOpenClubDetails}>
                {(clubSelected && newData) && (
                    <div className="clubDetailsContainer">
                        <h2 className="clubDetailsTitle">Editar club</h2>
                        <div className="clubDetails">
                            <div className="courtsManagementContainer">
                                <div className="courtsManagementHeader">
                                    <h3>Gestión de Canchas</h3>
                                    <Button
                                        width={window.innerWidth < 510 ? "100%" : "auto"}
                                        margin="0"
                                        padding=".5rem 1rem"
                                        backgroundColor="rgb(0, 173, 0)"
                                        color="white"
                                        onClick={() => handleOpenCourtForm()}
                                        icon={<PlusIcon width={16} height={16} fill="white" />}
                                    >
                                        Nueva Cancha
                                    </Button>
                                </div>
                                {courts.length === 0 ? (
                                    <div className="noCourtsMessage">
                                        <CameraIcon width={48} height={48} fill="#ccc" />
                                        <p>No hay canchas registradas</p>
                                        <p className="noCourtsSubtext">Agrega una nueva cancha para comenzar</p>
                                    </div>
                                ) : (
                                    <div className="courtsList">
                                        {courts.map((court) => (
                                            <div key={court.id} className="courtCard">
                                                <div className="courtCardHeader">
                                                    <div className="courtCardTitle">
                                                        <CameraIcon width={20} height={20} fill="#0077b6" />
                                                        <h4>{court.name}</h4>
                                                    </div>
                                                    <div className="courtCardActions">
                                                        <button
                                                            className="editCourtButton"
                                                            onClick={() => handleOpenCourtForm(court)}
                                                            title="Editar cancha"
                                                        >
                                                            <PencilIcon width={16} height={16} fill="#0077b6" />
                                                        </button>
                                                        <button
                                                            className="deleteCourtButton"
                                                            onClick={() => {
                                                                setCourtToDelete(court)
                                                            }}
                                                            title="Eliminar cancha"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="courtCardDetails">
                                                    <div className="courtDetailItem">
                                                        <span className="courtDetailLabel">Host de cámara:</span>
                                                        <span className="courtDetailValue">{court.cameraHost}</span>
                                                    </div>
                                                    <div className="courtDetailItem">
                                                        <span className="courtDetailLabel">Puerto:</span>
                                                        <span className="courtDetailValue">{court.cameraPort}</span>
                                                    </div>
                                                    <div className="courtDetailItem">
                                                        <span className="courtDetailLabel">Ruta:</span>
                                                        <span className="courtDetailValue">{court.cameraPath}</span>
                                                    </div>
                                                    <div className="courtDetailItem">
                                                        <span className="courtDetailLabel">Usuario RTSP:</span>
                                                        <span className="courtDetailValue">{court.rtspUsername}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="coverImageContainer">
                                <h3>Foto de portada</h3>
                                <div className="coverImageWrapper"
                                    style={{
                                        backgroundImage: clubSelected?.coverImageUrl
                                            ? `url(${clubSelected.coverImageUrl})`
                                            : `url("${DEFAULT_COVER_IMAGE_URL}")`,
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
                                            src={clubSelected.profileImageUrl ? clubSelected.profileImageUrl : DEFAULT_PROFILE_IMAGE_URL}
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
                                    onClick={handleDeleteClub}
                                    backgroundColor="rgb(221, 76, 76)"
                                    color="white"
                                >
                                    Eliminar Club
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
            <Modal isOpen={isOpenCourtForm} setIsOpen={setIsOpenCourtForm}>
                <div className="courtFormContainer">
                    <h2 className="courtFormTitle">
                        {courtToEdit ? "Editar Cancha" : "Nueva Cancha"}
                    </h2>
                    <form className="courtForm" onSubmit={(e) => { e.preventDefault(); handleSubmitCourtForm(); }}>
                        <div className="divInputClubInfo">
                            <label>Nombre de la cancha *</label>
                            <input
                                type="text"
                                value={courtFormData.name || ""}
                                onChange={(e) => setCourtFormData({ ...courtFormData, name: e.target.value })}
                                placeholder="Cancha 1"
                                required
                            />
                        </div>
                        <div className="divInputClubInfoRow">
                            <div className="divInputClubInfo">
                                <label>Host de la cámara *</label>
                                <input
                                    type="text"
                                    value={courtFormData.cameraHost || ""}
                                    onChange={(e) => setCourtFormData({ ...courtFormData, cameraHost: e.target.value })}
                                    placeholder="192.168.1.100"
                                    required
                                />
                            </div>
                            <div className="divInputClubInfo">
                                <label>Puerto de la cámara *</label>
                                <input
                                    type="number"
                                    value={courtFormData.cameraPort || 0}
                                    onChange={(e) => setCourtFormData({ ...courtFormData, cameraPort: parseInt(e.target.value) || 0 })}
                                    placeholder="554"
                                    required
                                    min="1"
                                    max="65535"
                                />
                            </div>
                        </div>
                        <div className="divInputClubInfo">
                            <label>Ruta de la cámara *</label>
                            <input
                                type="text"
                                value={courtFormData.cameraPath || ""}
                                onChange={(e) => setCourtFormData({ ...courtFormData, cameraPath: e.target.value })}
                                placeholder="/stream"
                                required
                            />
                        </div>
                        <div className="divInputClubInfo">
                            <label>Usuario RTSP *</label>
                            <input
                                type="text"
                                value={courtFormData.rtspUsername || ""}
                                onChange={(e) => setCourtFormData({ ...courtFormData, rtspUsername: e.target.value })}
                                placeholder="admin"
                                required
                            />
                        </div>
                        {
                            !courtToEdit &&
                            <div className="divInputClubInfo">
                                <label>Contraseña *</label>
                                <input
                                    type="text"
                                    value={courtFormData.rtspPassword || ""}
                                    onChange={(e) => setCourtFormData({ ...courtFormData, rtspPassword: e.target.value })}
                                    placeholder="****"
                                    required
                                />
                            </div>
                        }
                        <div className="courtFormActions">
                            <Button
                                width={window.innerWidth < 510 ? "100%" : "auto"}
                                padding=".5rem 1rem"
                                margin="0"
                                onClick={handleCloseCourtForm}
                                backgroundColor="grey"
                                color="white"
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button
                                width={window.innerWidth < 510 ? "100%" : "auto"}
                                padding=".5rem 1rem"
                                margin="0"
                                backgroundColor="rgb(0, 173, 0)"
                                color="white"
                                type="submit"
                                disabled={isLoadingPostCourt || isLoadingUpdateCourt}
                            >
                                {courtToEdit ? "Guardar cambios" : "Crear cancha"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
            <ModalLoading
                text={(isLoadingUploadLogo || isLoadingUploadCover || isLoadingDeleteLogo || isLoadingDeleteCover) ? "Acualizando imágen..." : "Cargando..."}
                isOpen={
                    isLoadingUploadLogo ||
                    isLoadingUploadCover ||
                    isLoadingDeleteLogo ||
                    isLoadingUpdateClub ||
                    isLoadingDeleteCover ||
                    isLoadingDeleteCourt ||
                    isLoadingDeleteClub
                }
            />
        </div>
    );
}

export default AdminInterface;
