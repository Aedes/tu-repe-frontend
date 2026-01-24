import { useEffect } from 'react';
import { toast } from 'sonner';
import { useFetchData } from '../hooks/useFetchData';
import { useAdminStore } from '../stores/adminStore';
import { BACKEND_API_URL } from '../config';
import type { ClubWithCourts, ICourt } from '../types';

export const useAdminActions = () => {
    const token = localStorage.getItem("access_token");
    const {
        clubs,
        selectedClub,
        editedClubData,
        courts,
        courtToEdit,
        courtFormData,
        isOpenForm,
        isOpenClubDetails,
        isOpenCourtForm,
        setClubs,
        addClub,
        updateClub,
        deleteClub,
        setSelectedClub,
        setEditedClubData,
        addCourt,
        updateCourt,
        deleteCourt,
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
        setErrorClubs,
        setErrorPostClub,
        isClubDataChanged
    } = useAdminStore();

    const { isLoading: isLoadingClubsFetch, error: errorClubsFetch, fetchData: fetchDataClubs } =
        useFetchData<typeof clubs>("GET");

    const { isLoading: isLoadingPostClubFetch, error: errorPostClubFetch, fetchData: fetchDataPostClub } =
        useFetchData<ClubWithCourts>("POST", token);

    const { isLoading: isLoadingUpdateClubFetch, fetchData: fetchDataUpdateClub } =
        useFetchData<ClubWithCourts>("PUT", token);

    const { isLoading: isLoadingDeleteClubFetch, fetchData: fetchDataDeleteClub } =
        useFetchData<ClubWithCourts>("DELETE", token);

    const { isLoading: isLoadingUploadLogoFetch, fetchData: fetchDataUploadLogo } =
        useFetchData<ClubWithCourts>("PUT", token);

    const { isLoading: isLoadingUploadCoverFetch, fetchData: fetchDataUploadCover } =
        useFetchData<ClubWithCourts>("PUT", token);

    const { isLoading: isLoadingDeleteLogoFetch, fetchData: fetchDataDeleteLogo } =
        useFetchData<ClubWithCourts>("DELETE", token);

    const { isLoading: isLoadingDeleteCoverFetch, fetchData: fetchDataDeleteCover } =
        useFetchData<ClubWithCourts>("DELETE", token);

    const { isLoading: isLoadingPostCourtFetch, fetchData: fetchDataPostCourt } =
        useFetchData<ICourt>("POST", token);

    const { isLoading: isLoadingUpdateCourtFetch, fetchData: fetchDataUpdateCourt } =
        useFetchData<ICourt>("PUT", token);

    const { isLoading: isLoadingDeleteCourtFetch, fetchData: fetchDataDeleteCourt } =
        useFetchData<ICourt>("DELETE", token);

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
        setErrorClubs(errorClubsFetch);
        if (errorClubsFetch) {
            console.error("Error fetching clubs:", errorClubsFetch);
            toast.error("Error al cargar los clubes. Por favor, intente nuevamente.");
        }
    }, [errorClubsFetch, setErrorClubs]);

    useEffect(() => {
        setErrorPostClub(errorPostClubFetch);
        if (errorPostClubFetch) {
            console.error("Error creating club:", errorPostClubFetch);
            toast.error("Error al crear el club. Por favor, intente nuevamente.");
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

    const handleCreateClub = async (data: { [key: string]: any }) => {
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
        const response = await fetchDataUpdateClub(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}`, editedClubData);
        if (response) {
            updateClub(response);
            toast.success("Club actualizado exitosamente.");
            return true;
        }
        toast.error("Error al actualizar el club. Por favor, intente nuevamente.");
        return false;
    };

    const handleDeleteClub = async () => {
        const response = await fetchDataDeleteClub(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}`);
        if (response) {
            deleteClub(selectedClub!.id!);
            toast.success("Club eliminado correctamente.");
            return true;
        }
        toast.error("No se pudo eliminar el club, intente nuevamente.");
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

        toast.error("Error al subir el logo. Por favor, intente nuevamente.");
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

        toast.error("Error al subir la portada. Por favor, intente nuevamente.");
    };

    const handleDeleteLogo = async () => {
        console.log("Eliminando Logo...");
        const response = await fetchDataDeleteLogo(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}/logo`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error("Error al eliminar el logo. Por favor, intente nuevamente.");
    };

    const handleDeleteCover = async () => {
        console.log("Eliminando Cover...");
        const response = await fetchDataDeleteCover(`${BACKEND_API_URL}/clubs/c/${selectedClub?.id}/cover`);
        if (response) {
            updateClub(response);
            toast.success("Imagen eliminada exitosamente.");
            return;
        }

        toast.error("Error al eliminar la portada. Por favor, intente nuevamente.");
    };

    const handleSubmitCourtForm = async () => {
        if (!selectedClub) return false;

        if (courtToEdit) {
            const response = await fetchDataUpdateCourt(`${BACKEND_API_URL}/courts/c/${courtToEdit?.id}/admin`, courtFormData);
            if (!response) {
                toast.error("No se pudo editar la cancha, intente nuevamente.");
                return false;
            }
            updateCourt(response);
            toast.success("Cancha editada correctamente.");
            return true;
        } else {
            const response = await fetchDataPostCourt(`${BACKEND_API_URL}/courts`, { ...courtFormData, clubId: selectedClub.id! });
            if (!response) {
                toast.error("No se pudo crear la cancha, intente nuevamente.");
                return false;
            }
            addCourt(response);
            toast.success("Cancha agregada correctamente.");
            return true;
        }
    };

    const handleDeleteCourt = async (courtId: string) => {
        if (!courtId) return false;
        const response = await fetchDataDeleteCourt(`${BACKEND_API_URL}/courts/c/${courtId}`);
        if (!response) {
            toast.error("No se pudo eliminar la cancha, intente nuevamente.");
            return false;
        }
        deleteCourt(parseInt(courtId));
        toast.success("Cancha eliminada correctamente.");
        return true;
    };

    return {
        clubs,
        selectedClub,
        editedClubData,
        courts,
        courtToEdit,
        courtFormData,
        isClubDataChanged: isClubDataChanged(),
        isOpenForm,
        isOpenClubDetails,
        isOpenCourtForm,

        handleCreateClub,
        handleUpdateClub,
        handleDeleteClub,
        handleLogoChange,
        handleCoverChange,
        handleDeleteLogo,
        handleDeleteCover,
        setSelectedClub,
        setEditedClubData,

        handleSubmitCourtForm,
        handleDeleteCourt,

        setIsOpenForm: useAdminStore.getState().setIsOpenForm,
        setIsOpenClubDetails: useAdminStore.getState().setIsOpenClubDetails,
        setIsOpenCourtForm: useAdminStore.getState().setIsOpenCourtForm,
        setCourtToEdit: useAdminStore.getState().setCourtToEdit,
        setCourtFormData: useAdminStore.getState().setCourtFormData,
        resetCourtFormData: useAdminStore.getState().resetCourtFormData,
        resetSelectedClub: useAdminStore.getState().resetSelectedClub
    };
};

