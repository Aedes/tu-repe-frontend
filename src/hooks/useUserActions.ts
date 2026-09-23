import { BACKEND_API_URL } from "../config"
import { useUserStore } from "../stores/userStore"
import type { ClubWithCourts, ICourt, UserWithClubs, Theme } from "../types"
import { toClubWriteDto } from "../dto/clubDto"
import { useFetchData } from "./useFetchData"
import { useEffect } from "react"
import { toast } from "sonner"
import { userFacingError } from "../api/errorMessage"

export const useUserActions = () => {
    const {
        user,
        clubs,
        courts,
        courtToEdit,
        courtFormData,
        isOpenClubForm,
        isOpenCourtForm,
        selectedClub,
        editedClubData,
        setClubs,
        updateClub,
        setIsLoadingClubs,
        setSelectedClub,
        setCourtToEdit,
        updateCourt,
        resetCourtFormData,
        resetSelectedClub,
        isClubDataChanged,
        setEditedClubData,
        setIsLoadingDeleteCover,
        setIsLoadingUploadCover,
        setIsLoadingDeleteLogo,
        setIsLoadingUploadLogo,
        setIsLoadingUpdateClub,
        setIsLoadingUpdateCourt,
        setIsLoadingChangeTheme,

        setCourtFormData,
    } = useUserStore()

    const { isLoading: isLoadingClubsFetch, error: _errorClubsFetch, fetchData: fetchDataClubs } =
        useFetchData<UserWithClubs>("GET");

    const { isLoading: isLoadingDeleteCoverFetch, fetchData: fetchDataDeleteCover, lastErrorRef: deleteCoverError } =
        useFetchData<ClubWithCourts>("DELETE");

    const { isLoading: isLoadingUploadCoverFetch, fetchData: fetchDataUploadCover, lastErrorRef: uploadCoverError } =
        useFetchData<ClubWithCourts>("PUT");

    const { isLoading: isLoadingDeleteLogoFetch, fetchData: fetchDataDeleteLogo, lastErrorRef: deleteLogoError } =
        useFetchData<ClubWithCourts>("DELETE");

    const { isLoading: isLoadingUploadLogoFetch, fetchData: fetchDataUploadLogo, lastErrorRef: uploadLogoError } =
        useFetchData<ClubWithCourts>("PUT");

    const { isLoading: isLoadingUpdateClubFetch, fetchData: fetchDataUpdateClub, lastErrorRef: updateClubError } =
        useFetchData<ClubWithCourts>("PUT");

    const { isLoading: isLoadingUpdateCourtFetch, fetchData: fetchDataUpdateCourt, lastErrorRef: updateCourtError } =
        useFetchData<ICourt>("PUT");

    const { isLoading: isLoadingChangeThemeFetch, fetchData: fetchDataChangeTheme, lastErrorRef: changeThemeError } =
        useFetchData<Theme>("PUT");
    const { fetchData: fetchDataLogout } = useFetchData<{ ok: boolean }>("POST");

    useEffect(() => {
        setIsLoadingClubs(isLoadingClubsFetch);
    }, [isLoadingClubsFetch, setIsLoadingClubs]);

    useEffect(() => {
        setIsLoadingDeleteCover(isLoadingDeleteCoverFetch);
    }, [isLoadingDeleteCoverFetch, setIsLoadingDeleteCover]);

    useEffect(() => {
        setIsLoadingUploadCover(isLoadingUploadCoverFetch);
    }, [isLoadingUploadCoverFetch, setIsLoadingUploadCover]);

    useEffect(() => {
        setIsLoadingDeleteLogo(isLoadingDeleteLogoFetch);
    }, [isLoadingDeleteLogoFetch, setIsLoadingDeleteLogo]);

    useEffect(() => {
        setIsLoadingUploadLogo(isLoadingUploadLogoFetch);
    }, [isLoadingUploadLogoFetch, setIsLoadingUploadLogo]);

    useEffect(() => {
        setIsLoadingUpdateClub(isLoadingUpdateClubFetch);
    }, [isLoadingUpdateClubFetch, setIsLoadingUpdateClub]);

    useEffect(() => {
        setIsLoadingUpdateCourt(isLoadingUpdateCourtFetch);
    }, [isLoadingUpdateCourtFetch, setIsLoadingUpdateCourt])

    useEffect(() => {
        setIsLoadingChangeTheme(isLoadingChangeThemeFetch);
    }, [isLoadingChangeThemeFetch, setIsLoadingChangeTheme]);

    useEffect(() => {
        const fetchClubsAndCourts = async () => {
            const data = await fetchDataClubs(`${BACKEND_API_URL}/users/clubs`);
            if (data?.clubs) {
                setClubs(data.clubs as ClubWithCourts[]);
            }
        };
        fetchClubsAndCourts();
    }, []);

    const handleDeleteCover = async () => {
        console.log("Eliminando Cover...");
        const response = await fetchDataDeleteCover(`${BACKEND_API_URL}/users/c/${selectedClub?.id}/cover`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error(userFacingError(deleteCoverError.current, "No se pudo eliminar la portada"));
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchDataUploadCover(`${BACKEND_API_URL}/users/c/${selectedClub?.id}/cover`, formData);
        if (response) {
            updateClub(response);
            toast.success("Imagen subida exitosamente.");
            return;
        }

        toast.error(userFacingError(uploadCoverError.current, "No se pudo subir la portada"));
    };

    const handleDeleteLogo = async () => {
        console.log("Eliminando Logo...");
        const response = await fetchDataDeleteLogo(`${BACKEND_API_URL}/users/c/${selectedClub?.id}/logo`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error(userFacingError(deleteLogoError.current, "No se pudo eliminar el logo"));
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchDataUploadLogo(`${BACKEND_API_URL}/users/c/${selectedClub?.id}/logo`, formData);
        if (response) {
            updateClub(response);
            toast.success("Imagen subida exitosamente.");
            return;
        }

        toast.error(userFacingError(uploadLogoError.current, "No se pudo subir el logo"));
    };

    const handleUpdateClub = async () => {
        if (!editedClubData) return false;
        const response = await fetchDataUpdateClub(`${BACKEND_API_URL}/users/c/${selectedClub?.id}`, toClubWriteDto(editedClubData));
        if (response) {
            updateClub(response);
            toast.success("Club actualizado exitosamente.");
            return true;
        }
        toast.error(userFacingError(updateClubError.current, "No se pudo actualizar el club"));
        return false;
    };

    const handleSubmitCourtForm = async () => {
        if (!selectedClub) return false;

        if (courtToEdit) {
            const response = await fetchDataUpdateCourt(`${BACKEND_API_URL}/users/court/${courtToEdit?.id}`, {
                name: courtFormData.name,
            });
            if (!response) {
                toast.error(userFacingError(updateCourtError.current, "No se pudo editar la cancha"));
                return false;
            }
            updateCourt(response);
            toast.success("Cancha editada correctamente.");
            return true;
        }
    };

    const handleChangeTheme = async () => {
        const response = await fetchDataChangeTheme(`${BACKEND_API_URL}/users/c/${editedClubData?.id}/theme`, {
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

    const handleLogout = async () => {
        await fetchDataLogout(`${BACKEND_API_URL}/auth/user/logout`);
        window.location.replace("/login-user");
    };

    return {
        user,
        clubs,
        courts,
        selectedClub,
        editedClubData,
        isOpenClubForm,
        isOpenCourtForm,
        courtToEdit,
        courtFormData,
        isClubDataChanged: isClubDataChanged(),

        setSelectedClub,
        setCourtToEdit,
        resetCourtFormData,
        resetSelectedClub,
        setEditedClubData,
        setCourtFormData,

        setIsOpenClubForm: useUserStore.getState().setIsOpenClubForm,
        setIsOpenCourtForm: useUserStore.getState().setIsOpenCourtForm,

        handleDeleteCover,
        handleDeleteLogo,
        handleCoverChange,
        handleLogoChange,
        handleUpdateClub,
        handleSubmitCourtForm,
        handleChangeTheme,
        handleLogout,
    }
}