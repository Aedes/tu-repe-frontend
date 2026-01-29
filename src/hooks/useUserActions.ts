import { BACKEND_API_URL } from "../config"
import { useUserStore } from "../stores/userStore"
import type { ClubWithCourts, ICourt, UserWithClubs } from "../types"
import { useFetchData } from "./useFetchData"
import { useEffect } from "react"
import { toast } from "sonner"

export const useUserActions = () => {
    const token = localStorage.getItem("access_token_user")
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
        setCourtFormData,
    } = useUserStore()

    const { isLoading: isLoadingClubsFetch, error: _errorClubsFetch, fetchData: fetchDataClubs } =
        useFetchData<UserWithClubs>("GET", token);

    const { isLoading: isLoadingDeleteCoverFetch, fetchData: fetchDataDeleteCover } =
        useFetchData<ClubWithCourts>("DELETE", token);

    const { isLoading: isLoadingUploadCoverFetch, fetchData: fetchDataUploadCover } =
        useFetchData<ClubWithCourts>("PUT", token);

    const { isLoading: isLoadingDeleteLogoFetch, fetchData: fetchDataDeleteLogo } =
        useFetchData<ClubWithCourts>("DELETE", token);

    const { isLoading: isLoadingUploadLogoFetch, fetchData: fetchDataUploadLogo } =
        useFetchData<ClubWithCourts>("PUT", token);

    const { isLoading: isLoadingUpdateClubFetch, fetchData: fetchDataUpdateClub } =
        useFetchData<ClubWithCourts>("PUT", token);

    const { isLoading: isLoadingUpdateCourtFetch, fetchData: fetchDataUpdateCourt } =
        useFetchData<ICourt>("PUT", token);

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
        const fetchClubsAndCourts = async () => {
            const data = await fetchDataClubs(`${BACKEND_API_URL}/users/clubs`);
            if (data.clubs) {
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

        toast.error("Error al eliminar la portada. Por favor, intente nuevamente.");
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

        toast.error("Error al subir la portada. Por favor, intente nuevamente.");
    };

    const handleDeleteLogo = async () => {
        console.log("Eliminando Logo...");
        const response = await fetchDataDeleteLogo(`${BACKEND_API_URL}/users/c/${selectedClub?.id}/logo`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error("Error al eliminar el logo. Por favor, intente nuevamente.");
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

        toast.error("Error al subir el logo. Por favor, intente nuevamente.");
    };

    const handleUpdateClub = async () => {
        if (!editedClubData) return false;
        const response = await fetchDataUpdateClub(`${BACKEND_API_URL}/users/c/${selectedClub?.id}`, editedClubData);
        if (response) {
            updateClub(response);
            toast.success("Club actualizado exitosamente.");
            return true;
        }
        toast.error("Error al actualizar el club. Por favor, intente nuevamente.");
        return false;
    };

    const handleSubmitCourtForm = async () => {
        if (!selectedClub) return false;

        if (courtToEdit) {
            const response = await fetchDataUpdateCourt(`${BACKEND_API_URL}/users/court/${courtToEdit?.id}`, courtFormData);
            if (!response) {
                toast.error("No se pudo editar la cancha, intente nuevamente.");
                return false;
            }
            updateCourt(response);
            toast.success("Cancha editada correctamente.");
            return true;
        }
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
        handleSubmitCourtForm
    }
}