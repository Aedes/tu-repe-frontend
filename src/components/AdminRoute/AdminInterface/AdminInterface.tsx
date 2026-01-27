import "./AdminInterface.css"
import NavBar from "../../common/NavBar/NavBar";
import StatCard from "./StatCard/StatCard";
import { CameraIcon, CompanyIcon, UsersIcon } from "../../../assets/Icons";
import Button from "../../common/Button/Button";
import { useAdminActions } from "../../../hooks/useAdminActions";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../../config";
import ModalForm from "../../common/ModalForm/ModalForm";
import Modal from "../../common/Modal/Modal";
import ModalLoading from "../../common/ModalLoading/ModalLoading";
import ClubDetails from "./ClubDetails/ClubDetails";
import CourtsForm from "./CourtsForm/CourtsForm";
import { useAdminStore } from "../../../stores/adminStore";
import UserDetails from "./UserDetails/UserDetails";

const AdminInterface = () => {
    const {
        isLoadingClubs,
        isLoadingUploadLogo,
        isLoadingUploadCover,
        isLoadingDeleteLogo,
        isLoadingUpdateClub,
        isLoadingDeleteCover,
        isLoadingDeleteCourt,
        isLoadingDeleteClub,
        isLoadingPostClub,
        isLoadingPostUser,
        isLoadingDeleteUser,
    } = useAdminStore()

    const {
        clubs,
        users,
        isOpenForm,
        isOpenClubDetails,
        isOpenCourtForm,
        isOpenUserForm,
        isOpenUserDetailsForm,
        handleCreateClub,
        handleCreateUser,
        setSelectedClub,
        setSelectedUser,
        setIsOpenForm,
        setIsOpenClubDetails,
        setIsOpenCourtForm,
        setIsOpenUserForm,
        setIsOpenUserDetailsForm,
    } = useAdminActions();

    const handleOpenClubDetails = (club: typeof clubs[0]) => {
        setSelectedClub(club);
        setIsOpenClubDetails(true);
    };

    const handleCreateClubAndClose = async (data: { [key: string]: any }) => {
        const success = await handleCreateClub(data);
        if (success) {
            setIsOpenForm(false);
        }
    };

    const handleCloseClubDetailsModal = (value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === 'function') {
            setIsOpenClubDetails(value(isOpenClubDetails));
        } else {
            setIsOpenClubDetails(value);
        }
    };

    const handleCloseCourtFormModal = (value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === 'function') {
            setIsOpenCourtForm(value(isOpenCourtForm));
        } else {
            setIsOpenCourtForm(value);
        }
    };

    const handleCreateUserAndClose = async (data: { [key: string]: any }) => {
        const success = await handleCreateUser(data);
        if (success) {
            setIsOpenUserForm(false);
        }
    };

    const handleOpenUserDetails = (user: typeof users[0]) => {
        setSelectedUser(user);
        setIsOpenUserDetailsForm(true);
    };

    return (
        <div className="adminInterfaceContainer">
            <NavBar context="club" />
            <div className="adminInterfacePanel">
                <div className="adminInterfaceTitle">
                    <div>
                        <h1>Hola, Aedes 👋</h1>
                        <p>Bienvenido al panel de administración de Tu Repe</p>
                    </div>
                    <div className="adminInterfaceActions">
                        <Button
                            margin="0"
                            onClick={() => setIsOpenForm(true)}
                            fontSize={window.innerWidth < 760 ? "0.9rem" : "1rem"}
                            padding={window.innerWidth < 760 ? "0.5rem 1rem" : ""}
                            backgroundColor="rgb(0, 173, 0)"
                            color="white"
                            disabled={isLoadingClubs}
                        >
                            + Nuevo Club
                        </Button>
                        <Button
                            margin="0"
                            onClick={() => setIsOpenUserForm(true)}
                            fontSize={window.innerWidth < 760 ? "0.9rem" : "1rem"}
                            padding={window.innerWidth < 760 ? "0.5rem 1rem" : ""}
                            backgroundColor="rgb(0, 173, 0)"
                            color="white"
                            disabled={isLoadingPostUser}
                        >
                            + Nuevo Usuario
                        </Button>
                    </div>
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
                                <StatCard
                                    icon={<UsersIcon
                                        width={window.innerWidth < 650 ? 24 : 30}
                                        height={window.innerWidth < 650 ? 24 : 30}
                                        fill="#0077b6"
                                    />}
                                    title="Dueños"
                                    quantity={users.length}
                                />
                            </div>
                            <div className="listOfClubsTableContainer">
                                <div className="listIconAndName">
                                    <CompanyIcon
                                        width={20}
                                        height={20}
                                        fill="balck"
                                    />
                                    <h2 className="listOfClubsTitle">Lista de Clubes</h2>
                                </div>
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
                                                            onClick={() => handleOpenClubDetails(c)}
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
                            <div className="listOfClubsTableContainer">
                                <div className="listIconAndName">
                                    <UsersIcon
                                        width={20}
                                        height={20}
                                        fill="balck"
                                    />
                                    <h2 className="listOfClubsTitle">Lista de Usuarios</h2>
                                </div>
                                <table className="listOfClubsTable">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Clubes</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users.map(u => {
                                                return <tr key={u.id}>
                                                    <td>
                                                        {u.name}
                                                    </td>
                                                    <td>
                                                        {u.email}
                                                    </td>
                                                    <td>{u.clubs?.length}</td>
                                                    <td>
                                                        <button
                                                            className="viewDetailsButton"
                                                            onClick={() => handleOpenUserDetails(u)}
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
                onSubmitForm={handleCreateClubAndClose}
                onClose={() => setIsOpenForm(false)}
                disabledButtons={isLoadingPostClub}
            />
            <ModalForm
                isOpen={isOpenUserForm}
                inputs={[
                    { label: "Nombre", type: "text", name: "name", placeholder: "Héctor Hugo", required: true },
                    { label: "Email", type: "text", name: "email", placeholder: "hectorhugo@email.com", required: true },
                    { label: "Contraseña", type: "text", name: "password", placeholder: "******", required: true },
                ]}
                title="Agregar nuevo usuario"
                subtitle="Los campos con * son obligatorios"
                initialData={{}}
                onSubmitForm={(data) => handleCreateUserAndClose(data)}
                onClose={() => setIsOpenUserForm(false)}
                disabledButtons={isLoadingPostUser}
            />
            <Modal isOpen={isOpenClubDetails} setIsOpen={handleCloseClubDetailsModal}>
                <ClubDetails />
            </Modal>
            <Modal isOpen={isOpenCourtForm} setIsOpen={handleCloseCourtFormModal}>
                <CourtsForm />
            </Modal>
            <Modal isOpen={isOpenUserDetailsForm}>
                <UserDetails />
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
                    isLoadingDeleteUser ||
                    isLoadingDeleteClub
                }
            />
        </div>
    );
}

export default AdminInterface;
