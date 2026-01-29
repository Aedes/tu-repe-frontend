import "./UserInterface.css"
import { useUserStore } from "../../../stores/userStore";
import NavBar from "../../common/NavBar/NavBar";
import StatCard from "../../AdminRoute/AdminInterface/StatCard/StatCard";
import { CompanyIcon, CameraIcon } from "../../../assets/Icons";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../../config";
import { useUserActions } from "../../../hooks/useUserActions";
import Modal from "../../common/Modal/Modal";
import ClubDetials from "./ClubDetials/ClubDetials";
import ModalLoading from "../../common/ModalLoading/ModalLoading";
import CourtsForm from "./CourtsForm/CourtsForm";

const UserInterface = () => {

    const {
        isLoadingClubs,
        isLoadingUpdateClub,
        isLoadingUploadCover,
        isLoadingUploadLogo,
        isLoadingDeleteCover,
        isLoadingDeleteLogo
    } = useUserStore()

    const {
        user,
        clubs,
        isOpenClubForm,
        isOpenCourtForm,
        setIsOpenClubForm,
        setSelectedClub,
        setIsOpenCourtForm
    } = useUserActions()

    const handleOpenClubForm = (club: typeof clubs[0]) => {
        setSelectedClub(club)
        setIsOpenClubForm(true)
    }

    const handleCloseClubDetailsModal = (value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === 'function') {
            setIsOpenClubForm(value(isOpenClubForm));
        } else {
            setIsOpenClubForm(value);
        }
    };

    const handleCloseCourtFormModal = (value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === 'function') {
            setIsOpenCourtForm(value(isOpenCourtForm));
        } else {
            setIsOpenCourtForm(value);
        }
    };

    return (
        <div className="adminInterfaceContainer">
            <NavBar context="club" />
            <div className="adminInterfacePanel">
                <div className="adminInterfaceTitle">
                    <div>
                        <h1>Hola, {user?.name} 👋</h1>
                        <p>Bienvenido al panel de administración de Tu Repe</p>
                    </div>
                </div>
                {
                    isLoadingClubs ?
                        <div className="loadingClubsStatsContainer">
                            <p>Cargando tus clubes...</p>
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
                                <div className="listIconAndName">
                                    <CompanyIcon
                                        width={20}
                                        height={20}
                                        fill="balck"
                                    />
                                    <h2 className="listOfClubsTitle">Tus Clubes</h2>
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
                                                            onClick={() => handleOpenClubForm(c)}
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
            <Modal isOpen={isOpenClubForm} setIsOpen={handleCloseClubDetailsModal}>
                <ClubDetials />
            </Modal>
            <Modal isOpen={isOpenCourtForm} setIsOpen={handleCloseCourtFormModal}>
                <CourtsForm />
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

export default UserInterface;
