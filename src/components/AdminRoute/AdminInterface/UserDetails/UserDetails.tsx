import "./UserDetails.css"
import { useAdminActions } from "../../../../hooks/useAdminActions";
import Button from "../../../common/Button/Button";
import { useAdminStore } from "../../../../stores/adminStore";
import { PlusIcon, CompanyIcon, TrashIcon } from "../../../../assets/Icons";
import { BACKEND_API_URL, DEFAULT_PROFILE_IMAGE_URL } from "../../../../config";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useState } from "react";
import { toast } from "sonner";
import { userFacingError } from "../../../../api/errorMessage";
import type { IClub } from "../../../../types";

const UserDetails = () => {
    const {
        isLoadingUpdateUser,
        addClubTouser,
        removeClubFromUser
    } = useAdminStore()

    const {
        clubs,
        userSelected,
        editedUserData,
        isUserDataChanged,
        setEditedUserData,
        setIsOpenUserDetailsForm,
        resetSelectedClub,
        handleUpdateUser,
        handleDeleteUser,
    } = useAdminActions()

    const { isLoading: isLoadingAssignOwner, fetchData: fetchDataAssignOwner, lastErrorRef: assignOwnerError } = useFetchData<{ clubAssigned: IClub }>("POST")
    const { isLoading: isLoadingUnassignOwner, fetchData: fetchDataUnassignOwner, lastErrorRef: unassignOwnerError } = useFetchData<{ clubUnassigned: IClub }>("DELETE")
    const [barClubsOpen, setBarClubsOpen] = useState(false)

    const handleCloseUserDetails = () => {
        setIsOpenUserDetailsForm(false)
        resetSelectedClub()
    }

    const handleDeleteUserAndClose = async () => {
        const success = await handleDeleteUser()
        if (success) {
            handleCloseUserDetails();
        }
    }

    const handleAssignOwner = async (clubId: string) => {
        setBarClubsOpen(false)
        const userId = userSelected?.id
        if (!userId) {
            toast.error("No se pudo asignar el dueño")
            return
        }
        const response = await fetchDataAssignOwner(`${BACKEND_API_URL}/users/cu`, {
            userId,
            clubId
        })

        if (!response) {
            toast.error(userFacingError(assignOwnerError.current, "No se pudo asignar el dueño"))
            return
        }

        addClubTouser(response.clubAssigned, userId)
        toast.success("Dueño asignado con éxito.")
    }

    const handleUnassignOwner = async (clubId: string) => {
        const userId = userSelected?.id
        if (!userId) {
            toast.error("No se pudo quitar el dueño")
            return
        }
        const response = await fetchDataUnassignOwner(`${BACKEND_API_URL}/users/cu`, {
            userId,
            clubId
        })

        if (!response?.clubUnassigned.id) {
            toast.error(userFacingError(unassignOwnerError.current, "No se pudo quitar el dueño"))
            return
        }

        removeClubFromUser(response.clubUnassigned.id, userId)
        toast.success("Dueño desasignado con éxito.")
    }

    if (!userSelected || !editedUserData) return null

    return (
        <div className="clubDetailsContainer">
            <h2 className="clubDetailsTitle">Editar usuario</h2>
            <div className="clubDetails">
                <div className="clubInfoContainer">
                    <div className="divInputClubInfo">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={editedUserData.name}
                            onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
                        />
                    </div>
                    <div className="divInputClubInfo">
                        <label>Email:</label>
                        <input
                            type="text"
                            value={editedUserData.email}
                            onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
                        />
                    </div>
                    <div className="courtsManagementHeader headerAssingOwner">
                        <h3>Dueño de</h3>
                        <Button
                            width={window.innerWidth < 510 ? "100%" : "auto"}
                            margin="0"
                            padding=".4rem .8rem"
                            fontSize=".9rem"
                            backgroundColor="rgb(0, 173, 0)"
                            color="white"
                            onClick={() => setBarClubsOpen(!barClubsOpen)}
                            icon={<PlusIcon width={16} height={16} fill="white" />}
                            disabled={isLoadingAssignOwner || isLoadingUnassignOwner}
                        >
                            Asignar club
                        </Button>
                        {
                            barClubsOpen && <ul className="resultsClubsAssingOwner animation-fade-in">
                                {clubs
                                    .filter(c => !userSelected.clubs?.some(userClub => userClub.id === c.id))
                                    .map(club => (
                                        <button
                                            className="clubItem"
                                            key={club.id}
                                            onClick={() => handleAssignOwner(club.id!)}
                                        >
                                            <div className="logoClubContainer">
                                                <img className="searchLogoImg" src={club.profileImageUrl ? club.profileImageUrl : DEFAULT_PROFILE_IMAGE_URL} alt="Logo del club" />
                                                <p className="searchClubName">{club.name}</p>
                                            </div>
                                            <p className="searchLocation">{club.city}, {club.address}</p>
                                        </button>
                                    ))
                                }
                            </ul>
                        }
                    </div>
                    {userSelected.clubs?.length === 0 ? (
                        <div className="noCourtsMessage">
                            <CompanyIcon width={48} height={48} fill="#ccc" />
                            <p>No hay clubes registrados</p>
                            <p className="noCourtsSubtext">Agrega un nuevo club para comenzar</p>
                        </div>
                    ) : (
                        <div className="courtsList">
                            {userSelected.clubs?.map((club) => (
                                <div key={club.id} className="courtCard">
                                    <div className="courtCardHeader">
                                        <div className="courtCardTitle">
                                            <img className="logoClubTable" src={club.profileImageUrl ? club.profileImageUrl : DEFAULT_PROFILE_IMAGE_URL} alt="Logo del club" />
                                            <h4>{club.name}</h4>
                                        </div>
                                        <div className="courtCardActions">
                                            <button
                                                className="deleteCourtButton"
                                                onClick={() => handleUnassignOwner(club.id!)}
                                                title="Eliminar cancha"
                                                disabled={isLoadingAssignOwner || isLoadingUnassignOwner}
                                            >
                                                <TrashIcon
                                                    width={20}
                                                    height={20}
                                                    fill="red"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="courtCardDetails">
                                        <div className="courtDetailItem">
                                            <span className="courtDetailLabel">Dirección:</span>
                                            <span className="courtDetailValue addressDetail">{club.address}, {club.city},  {club.province}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="clubDetailsActions">
                        <Button
                            width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                            margin="0"
                            onClick={handleCloseUserDetails}
                            backgroundColor="grey"
                            color="white"
                            disabled={isLoadingUpdateUser || isLoadingAssignOwner || isLoadingUnassignOwner}
                        >
                            Cancelar
                        </Button>
                        <Button
                            width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                            margin="0"
                            onClick={handleDeleteUserAndClose}
                            backgroundColor="rgb(221, 76, 76)"
                            color="white"
                            disabled={isLoadingUpdateUser || isLoadingAssignOwner || isLoadingUnassignOwner}
                        >
                            Eliminar Usuario
                        </Button>
                        <Button
                            width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                            margin="0"
                            onClick={handleUpdateUser}
                            backgroundColor="rgb(0, 173, 0)"
                            color="white"
                            disabled={!isUserDataChanged || isLoadingUpdateUser || isLoadingAssignOwner || isLoadingUnassignOwner}
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;
