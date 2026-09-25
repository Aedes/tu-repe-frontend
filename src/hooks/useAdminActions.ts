import { useEffect } from 'react';
import { toast } from 'sonner';
import { useFetchData } from '../hooks/useFetchData';
import { useAdminStore } from '../stores/adminStore';
import { BACKEND_API_URL } from '../config';
import type { ClubWithCourts, ICourt, IUser, Theme, UserWithClubs } from '../types';
import { toClubWriteDto } from '../dto/clubDto';
import { userFacingError } from '../api/errorMessage';
import type { DataForm } from './useFormData';

export const useAdminActions = () => {
    const {
        clubs,
        selectedClub,
        editedClubData,
        courts,
        courtToEdit,
        courtFormData,
        users,
        userSelected,
        editedUserData,
        isOpenForm,
        isOpenClubDetails,
        isOpenCourtForm,
        isOpenUserForm,
        isOpenUserDetailsForm,
        setClubs,
        addClub,
        updateClub,
        deleteClub,
        setSelectedClub,
        setEditedClubData,
        addCourt,
        updateCourt,
        deleteCourt,
        setUsers,
        addUser,
        updateUser,
        deleteUser,
        setSelectedUser,
        setEditedUserData,
        setIsLoadingClubs,
        setIsLoadingPostClub,
        setIsLoadingUpdateClub,
        setIsLoadingDeleteClub,
        setIsLoadingUploadLogo,
        setIsLoadingUploadCover,
        setIsLoadingDeleteLogo,
        setIsLoadingDeleteCover,
        setIsLoadingPostCourt,
        setIsLoadingUpdateCourt,
        setIsLoadingDeleteCourt,
        setIsLoadingPostUser,
        setIsLoadingGetUsers,
        setIsLoadingUpdateUser,
        setIsLoadingDeleteUser,
        setIsLoadingChangeTheme,
        setErrorClubs,
        setErrorPostClub,
        isClubDataChanged,
        isUserDataChanged,
    } = useAdminStore();

    const { isLoading: isLoadingClubsFetch, error: errorClubsFetch, fetchData: fetchDataClubs } =
        useFetchData<typeof clubs>("GET");

    const { isLoading: isLoadingPostClubFetch, error: errorPostClubFetch, fetchData: fetchDataPostClub } =
        useFetchData<ClubWithCourts>("POST");

    const { isLoading: isLoadingUpdateClubFetch, fetchData: fetchDataUpdateClub, lastErrorRef: updateClubError } =
        useFetchData<ClubWithCourts>("PUT");

    const { isLoading: isLoadingDeleteClubFetch, fetchData: fetchDataDeleteClub, lastErrorRef: deleteClubError } =
        useFetchData<ClubWithCourts>("DELETE");

    const { isLoading: isLoadingUploadLogoFetch, fetchData: fetchDataUploadLogo, lastErrorRef: uploadLogoError } =
        useFetchData<ClubWithCourts>("PUT");

    const { isLoading: isLoadingUploadCoverFetch, fetchData: fetchDataUploadCover, lastErrorRef: uploadCoverError } =
        useFetchData<ClubWithCourts>("PUT");

    const { isLoading: isLoadingDeleteLogoFetch, fetchData: fetchDataDeleteLogo, lastErrorRef: deleteLogoError } =
        useFetchData<ClubWithCourts>("DELETE");

    const { isLoading: isLoadingDeleteCoverFetch, fetchData: fetchDataDeleteCover, lastErrorRef: deleteCoverError } =
        useFetchData<ClubWithCourts>("DELETE");

    const { isLoading: isLoadingPostCourtFetch, fetchData: fetchDataPostCourt, lastErrorRef: createCourtError } =
        useFetchData<ICourt>("POST");

    const { isLoading: isLoadingUpdateCourtFetch, fetchData: fetchDataUpdateCourt, lastErrorRef: updateCourtError } =
        useFetchData<ICourt>("PUT");

    const { isLoading: isLoadingDeleteCourtFetch, fetchData: fetchDataDeleteCourt, lastErrorRef: deleteCourtError } =
        useFetchData<ICourt>("DELETE");

    const { isLoading: isLoadingPostUserFetch, fetchData: fetchDataPostUser, lastErrorRef: createUserError } =
        useFetchData<IUser>("POST");

    const { isLoading: isLoadingGetUsersFetch, fetchData: fetchDataGetUsers } =
        useFetchData<UserWithClubs[]>("GET");

    const { isLoading: isLoadingUpdateUserFetch, fetchData: fetchDataUpdateUser, lastErrorRef: updateUserError } =
        useFetchData<UserWithClubs>("PUT");

    const { isLoading: isLoadingDeleteUserFetch, fetchData: fetchDataDeleteUser, lastErrorRef: deleteUserError } =
        useFetchData<UserWithClubs>("DELETE");

    const { isLoading: isLoadingChangeThemeFetch, fetchData: fetchDataChangeTheme, lastErrorRef: changeThemeError } =
        useFetchData<Theme>("PUT");
    const { fetchData: fetchDataRotateKey, lastErrorRef: rotateKeyError } = useFetchData<ICourt & { streamKey?: string; cameraPath?: string }>("POST");
    const { fetchData: fetchDataPublishTarget, lastErrorRef: publishTargetError } = useFetchData<{ cameraPath: string; streamKey: string }>("GET");
    const { fetchData: fetchDataLogout } = useFetchData<{ ok: boolean }>("POST");

    useEffect(() => {
        setIsLoadingClubs(isLoadingClubsFetch);
    }, [isLoadingClubsFetch, setIsLoadingClubs]);

    useEffect(() => {
        setIsLoadingPostClub(isLoadingPostClubFetch);
    }, [isLoadingPostClubFetch, setIsLoadingPostClub]);

    useEffect(() => {
        setIsLoadingUpdateClub(isLoadingUpdateClubFetch);
    }, [isLoadingUpdateClubFetch, setIsLoadingUpdateClub]);

    useEffect(() => {
        setIsLoadingDeleteClub(isLoadingDeleteClubFetch);
    }, [isLoadingDeleteClubFetch, setIsLoadingDeleteClub]);

    useEffect(() => {
        setIsLoadingUploadLogo(isLoadingUploadLogoFetch);
    }, [isLoadingUploadLogoFetch, setIsLoadingUploadLogo]);

    useEffect(() => {
        setIsLoadingUploadCover(isLoadingUploadCoverFetch);
    }, [isLoadingUploadCoverFetch, setIsLoadingUploadCover]);

    useEffect(() => {
        setIsLoadingDeleteLogo(isLoadingDeleteLogoFetch);
    }, [isLoadingDeleteLogoFetch, setIsLoadingDeleteLogo]);

    useEffect(() => {
        setIsLoadingDeleteCover(isLoadingDeleteCoverFetch);
    }, [isLoadingDeleteCoverFetch, setIsLoadingDeleteCover]);

    useEffect(() => {
        setIsLoadingPostCourt(isLoadingPostCourtFetch);
    }, [isLoadingPostCourtFetch, setIsLoadingPostCourt]);

    useEffect(() => {
        setIsLoadingUpdateCourt(isLoadingUpdateCourtFetch);
    }, [isLoadingUpdateCourtFetch, setIsLoadingUpdateCourt]);

    useEffect(() => {
        setIsLoadingDeleteCourt(isLoadingDeleteCourtFetch);
    }, [isLoadingDeleteCourtFetch, setIsLoadingDeleteCourt]);

    useEffect(() => {
        setIsLoadingPostUser(isLoadingPostUserFetch);
    }, [isLoadingPostUserFetch, setIsLoadingPostUser]);

    useEffect(() => {
        setIsLoadingGetUsers(isLoadingGetUsersFetch);
    }, [isLoadingGetUsersFetch, setIsLoadingGetUsers]);

    useEffect(() => {
        setIsLoadingUpdateUser(isLoadingUpdateUserFetch);
    }, [isLoadingUpdateUserFetch, setIsLoadingUpdateUser]);

    useEffect(() => {
        setIsLoadingDeleteUser(isLoadingDeleteUserFetch);
    }, [isLoadingDeleteUserFetch, setIsLoadingDeleteUser]);

    useEffect(() => {
        setIsLoadingChangeTheme(isLoadingChangeThemeFetch);
    }, [isLoadingChangeThemeFetch, setIsLoadingChangeTheme]);

    useEffect(() => {
        setErrorClubs(errorClubsFetch);
        if (errorClubsFetch) {
            console.error("Error fetching clubs:", errorClubsFetch);
            toast.error(userFacingError(errorClubsFetch, "No se pudieron cargar los clubes"));
        }
    }, [errorClubsFetch, setErrorClubs]);

    useEffect(() => {
        setErrorPostClub(errorPostClubFetch);
        if (errorPostClubFetch) {
            console.error("Error creating club:", errorPostClubFetch);
            toast.error(userFacingError(errorPostClubFetch, "No se pudo crear el club"));
        }
    }, [errorPostClubFetch, setErrorPostClub]);

    useEffect(() => {
        const fetchClubsAndCourts = async () => {
            const clubsData = await fetchDataClubs(`${BACKEND_API_URL}/clubs/with-courts`);
            if (clubsData) {
                setClubs(clubsData);
            }
        };
        fetchClubsAndCourts();
    }, []);

    useEffect(() => {
        const fetchUsersAndClubs = async () => {
            const usersData = await fetchDataGetUsers(`${BACKEND_API_URL}/users`);
            if (usersData) {
                setUsers(usersData);
            }
        };
        fetchUsersAndClubs();
    }, []);

    const handleCreateClub = async (data: DataForm) => {
        const newClub = await fetchDataPostClub(`${BACKEND_API_URL}/clubs`, data);
        if (newClub) {
            addClub(newClub);
            toast.success("Club creado exitosamente.");
            return true;
        }
        return false;
    };

    const handleUpdateClub = async () => {
        if (!editedClubData) return false;
        const response = await fetchDataUpdateClub(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}`, toClubWriteDto(editedClubData));
        if (response) {
            updateClub(response);
            toast.success("Club actualizado exitosamente.");
            return true;
        }
        toast.error(userFacingError(updateClubError.current, "No se pudo actualizar el club"));
        return false;
    };

    const handleDeleteClub = async () => {
        const response = await fetchDataDeleteClub(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}`);
        if (response) {
            setIsLoadingDeleteClub(false)
            deleteClub(selectedClub!.id!);
            toast.success("Club eliminado correctamente.");
            return true;
        }
        toast.error(userFacingError(deleteClubError.current, "No se pudo eliminar el club"));
        return false;
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchDataUploadLogo(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}/logo`, formData);
        if (response) {
            updateClub(response);
            toast.success("Imagen subida exitosamente.");
            return;
        }

        toast.error(userFacingError(uploadLogoError.current, "No se pudo subir el logo"));
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchDataUploadCover(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}/cover`, formData);
        if (response) {
            updateClub(response);
            toast.success("Imagen subida exitosamente.");
            return;
        }

        toast.error(userFacingError(uploadCoverError.current, "No se pudo subir la portada"));
    };

    const handleDeleteLogo = async () => {
        console.log("Eliminando Logo...");
        const response = await fetchDataDeleteLogo(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}/logo`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error(userFacingError(deleteLogoError.current, "No se pudo eliminar el logo"));
    };

    const handleDeleteCover = async () => {
        console.log("Eliminando Cover...");
        const response = await fetchDataDeleteCover(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}/cover`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error(userFacingError(deleteCoverError.current, "No se pudo eliminar la portada"));
    };

    const handleSubmitCourtForm = async () => {
        if (!selectedClub) return false;

        if (courtToEdit) {
            const response = await fetchDataUpdateCourt(`${BACKEND_API_URL}/courts/c/${courtToEdit?.id}/admin`, {
                name: courtFormData.name,
                cameraHost: courtFormData.cameraHost,
            });
            if (!response) {
                toast.error(userFacingError(updateCourtError.current, "No se pudo editar la cancha"));
                return false;
            }
            updateCourt(response);
            toast.success("Cancha editada correctamente.");
            return true;
        } else {
            const response = await fetchDataPostCourt(`${BACKEND_API_URL}/courts`, {
                name: courtFormData.name,
                cameraHost: courtFormData.cameraHost,
                clubId: selectedClub.id!,
            });
            if (!response) {
                toast.error(userFacingError(createCourtError.current, "No se pudo crear la cancha"));
                return false;
            }
            addCourt(response);
            if (response.cameraPath) {
                toast.success(`Cancha creada. Ruta: ${response.cameraPath}`, { duration: 20000 });
            } else {
                toast.success("Cancha agregada correctamente.");
            }
            return true;
        }
    };

    const handleDeleteCourt = async (courtId: string) => {
        if (!courtId) return false;
        const response = await fetchDataDeleteCourt(`${BACKEND_API_URL}/courts/c/${courtId}`);
        if (!response) {
            toast.error(userFacingError(deleteCourtError.current, "No se pudo eliminar la cancha"));
            return false;
        }
        deleteCourt(courtId);
        toast.success("Cancha eliminada correctamente.");
        return true;
    };

    const handleCreateUser = async (data: DataForm) => {
        const response = await fetchDataPostUser(`${BACKEND_API_URL}/users`, data)
        if (!response) {
            toast.error(userFacingError(createUserError.current, "No se pudo crear el usuario"));
            return false;
        }
        addUser(response)
        toast.success("Usuario creado exitosamente.")
        return true
    }

    const handleUpdateUser = async () => {
        if (!editedUserData) return false;
        const response = await fetchDataUpdateUser(`${BACKEND_API_URL}/users/u/${userSelected?.id}`, {
            name: editedUserData.name,
            email: editedUserData.email,
        });
        if (response) {
            updateUser(response);
            toast.success("Usuario actualizado exitosamente.");
            return true;
        }
        toast.error(userFacingError(updateUserError.current, "No se pudo actualizar el usuario"));
        return false;
    };

    const handleDeleteUser = async () => {
        const response = await fetchDataDeleteUser(`${BACKEND_API_URL}/users/u/${userSelected?.id}`);
        if (response) {
            deleteUser(userSelected!.id!);
            toast.success("Usuario eliminado correctamente.");
            return true;
        }
        toast.error(userFacingError(deleteUserError.current, "No se pudo eliminar el usuario"));
        return false;
    };

    const handleRotateStreamKey = async (courtId: string) => {
        const response = await fetchDataRotateKey(`${BACKEND_API_URL}/courts/c/${courtId}/rotate-stream-key`);
        if (!response?.streamKey || !response.cameraPath) {
            toast.error(userFacingError(rotateKeyError.current, "No se pudo cambiar la clave de la cámara"));
            return null;
        }
        updateCourt(response);
        toast.success(`Clave rotada. Nueva ruta: ${response.cameraPath}`, { duration: 20000 });
        return { cameraPath: response.cameraPath, streamKey: response.streamKey };
    };

    const handleRevealPublishTarget = async (courtId: string) => {
        const response = await fetchDataPublishTarget(`${BACKEND_API_URL}/courts/c/${courtId}/publish-target`);
        if (!response?.cameraPath || !response.streamKey) {
            toast.error(userFacingError(publishTargetError.current, "No se pudo obtener la ruta de la cámara"));
            return null;
        }
        return response;
    };

    const handleLogout = async () => {
        await fetchDataLogout(`${BACKEND_API_URL}/auth/admin/logout`);
        window.location.replace("/login-admin");
    };

    const handleChangeTheme = async () => {
        const response = await fetchDataChangeTheme(`${BACKEND_API_URL}/clubs/c/${editedClubData?.id}/theme`, {
            theme: editedClubData?.theme
        })
        if (response) {
            updateClub({ ...editedClubData, theme: response } as ClubWithCourts)
            toast.success("Colores cambiados correctamente.");
            return true;
        }
        toast.error(userFacingError(changeThemeError.current, "No se pudieron cambiar los colores"));
        return false;
    }

    return {
        clubs,
        selectedClub,
        editedClubData,
        courts,
        courtToEdit,
        courtFormData,
        users,
        userSelected,
        editedUserData,
        isClubDataChanged: isClubDataChanged(),
        isUserDataChanged: isUserDataChanged(),
        isOpenForm,
        isOpenClubDetails,
        isOpenCourtForm,
        isOpenUserForm,
        isOpenUserDetailsForm,

        handleCreateClub,
        handleUpdateClub,
        handleDeleteClub,
        handleLogoChange,
        handleCoverChange,
        handleDeleteLogo,
        handleDeleteCover,
        handleCreateUser,
        handleUpdateUser,
        handleDeleteUser,
        handleChangeTheme,

        setSelectedClub,
        setEditedClubData,
        setEditedUserData,
        setSelectedUser,

        handleSubmitCourtForm,
        handleDeleteCourt,
        handleRotateStreamKey,
        handleRevealPublishTarget,
        handleLogout,

        setIsOpenForm: useAdminStore.getState().setIsOpenForm,
        setIsOpenClubDetails: useAdminStore.getState().setIsOpenClubDetails,
        setIsOpenCourtForm: useAdminStore.getState().setIsOpenCourtForm,
        setIsOpenUserForm: useAdminStore.getState().setIsOpenUserForm,
        setIsOpenUserDetailsForm: useAdminStore.getState().setIsOpenUserDetailsForm,
        setCourtToEdit: useAdminStore.getState().setCourtToEdit,
        setCourtFormData: useAdminStore.getState().setCourtFormData,
        resetCourtFormData: useAdminStore.getState().resetCourtFormData,
        resetSelectedClub: useAdminStore.getState().resetSelectedClub
    };
};

