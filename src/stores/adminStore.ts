import { create } from 'zustand';
import type { ClubWithCourts, IClub, ICourt } from '../types';

interface AdminState {
    clubs: ClubWithCourts[];
    selectedClub: ClubWithCourts | null;
    editedClubData: IClub | null;

    courts: ICourt[];
    courtToEdit: ICourt | null;
    courtFormData: Partial<ICourt & { rtspPassword: string }>;

    isOpenForm: boolean;
    isOpenClubDetails: boolean;
    isOpenCourtForm: boolean;

    isLoadingClubs: boolean;
    isLoadingPostClub: boolean;
    isLoadingUpdateClub: boolean;
    isLoadingDeleteClub: boolean;
    isLoadingUploadLogo: boolean;
    isLoadingUploadCover: boolean;
    isLoadingDeleteLogo: boolean;
    isLoadingDeleteCover: boolean;
    isLoadingPostCourt: boolean;
    isLoadingUpdateCourt: boolean;
    isLoadingDeleteCourt: boolean;

    errorClubs: Error | null;
    errorPostClub: Error | null;

    setClubs: (clubs: ClubWithCourts[]) => void;
    addClub: (club: IClub) => void;
    updateClub: (club: ClubWithCourts) => void;
    deleteClub: (clubId: number) => void;
    setSelectedClub: (club: ClubWithCourts | null) => void;
    setEditedClubData: (data: IClub | null) => void;
    updateClubInList: (club: IClub) => void;

    setCourts: (courts: ICourt[]) => void;
    addCourt: (court: ICourt) => void;
    updateCourt: (court: ICourt) => void;
    deleteCourt: (courtId: number) => void;
    setCourtToEdit: (court: ICourt | null) => void;
    setCourtFormData: (data: Partial<ICourt & { rtspPassword: string }>) => void;
    resetCourtFormData: () => void;

    setIsOpenForm: (isOpen: boolean) => void;
    setIsOpenClubDetails: (isOpen: boolean) => void;
    setIsOpenCourtForm: (isOpen: boolean) => void;

    setIsLoadingClubs: (isLoading: boolean) => void;
    setIsLoadingPostClub: (isLoading: boolean) => void;
    setIsLoadingUpdateClub: (isLoading: boolean) => void;
    setIsLoadingDeleteClub: (isLoading: boolean) => void;
    setIsLoadingUploadLogo: (isLoading: boolean) => void;
    setIsLoadingUploadCover: (isLoading: boolean) => void;
    setIsLoadingDeleteLogo: (isLoading: boolean) => void;
    setIsLoadingDeleteCover: (isLoading: boolean) => void;
    setIsLoadingPostCourt: (isLoading: boolean) => void;
    setIsLoadingUpdateCourt: (isLoading: boolean) => void;
    setIsLoadingDeleteCourt: (isLoading: boolean) => void;

    setErrorClubs: (error: Error | null) => void;
    setErrorPostClub: (error: Error | null) => void;

    isClubDataChanged: () => boolean;
    resetSelectedClub: () => void;
}

const initialCourtFormData: Partial<ICourt & { rtspPassword: string }> = {
    name: "",
    cameraHost: "",
    cameraPort: 0,
    cameraPath: "",
    rtspUsername: "",
    rtspPassword: ""
};

export const useAdminStore = create<AdminState>((set, get) => ({
    clubs: [],
    selectedClub: null,
    editedClubData: null,
    courts: [],
    courtToEdit: null,
    courtFormData: initialCourtFormData,
    isOpenForm: false,
    isOpenClubDetails: false,
    isOpenCourtForm: false,
    isLoadingClubs: false,
    isLoadingPostClub: false,
    isLoadingUpdateClub: false,
    isLoadingDeleteClub: false,
    isLoadingUploadLogo: false,
    isLoadingUploadCover: false,
    isLoadingDeleteLogo: false,
    isLoadingDeleteCover: false,
    isLoadingPostCourt: false,
    isLoadingUpdateCourt: false,
    isLoadingDeleteCourt: false,
    errorClubs: null,
    errorPostClub: null,

    setClubs: (clubs) => set({ clubs }),
    addClub: (club) => set((state) => ({
        clubs: [...state.clubs, { ...club, courts: [] }]
    })),
    updateClub: (club) => {
        const state = get();
        const updatedClubs = state.clubs.map(c => c.id === club.id ? { ...c, ...club } : c);
        set({
            clubs: updatedClubs,
            selectedClub: state.selectedClub?.id === club.id
                ? { ...state.selectedClub, ...club }
                : state.selectedClub,
            editedClubData: state.editedClubData?.id === club.id
                ? { ...state.editedClubData, ...club }
                : state.editedClubData
        });
    },
    deleteClub: (clubId) => set((state) => ({
        clubs: state.clubs.filter(c => c.id !== clubId),
        selectedClub: state.selectedClub?.id === clubId ? null : state.selectedClub,
        editedClubData: state.editedClubData?.id === clubId ? null : state.editedClubData
    })),
    setSelectedClub: (club) => set({
        selectedClub: club,
        editedClubData: club ? { ...club } : null,
        courts: club?.courts || []
    }),
    setEditedClubData: (data) => set({ editedClubData: data }),
    updateClubInList: (club) => set((state) => ({
        clubs: state.clubs.map(c => c.id === club.id ? { ...c, ...club } : c)
    })),

    setCourts: (courts) => set({ courts }),
    addCourt: (court) => {
        const state = get();
        const updatedCourts = [...state.courts, court];
        set({ courts: updatedCourts });

        if (state.selectedClub) {
            const updatedClub = { ...state.selectedClub, courts: updatedCourts };
            const updatedClubs = state.clubs.map(c =>
                c.id === state.selectedClub!.id ? updatedClub : c
            );
            set({
                clubs: updatedClubs,
                selectedClub: updatedClub,
                editedClubData: state.editedClubData
                    ? { ...state.editedClubData, courts: updatedCourts } as IClub
                    : null
            });
        }
    },
    updateCourt: (court) => {
        const state = get();
        const updatedCourts = state.courts.map(c => c.id === court.id ? court : c);
        set({ courts: updatedCourts });

        if (state.selectedClub) {
            const updatedClub = { ...state.selectedClub, courts: updatedCourts };
            const updatedClubs = state.clubs.map(c =>
                c.id === state.selectedClub!.id ? updatedClub : c
            );
            set({
                clubs: updatedClubs,
                selectedClub: updatedClub,
                editedClubData: state.editedClubData
                    ? { ...state.editedClubData, courts: updatedCourts } as IClub
                    : null
            });
        }
    },
    deleteCourt: (courtId) => {
        const state = get();
        const updatedCourts = state.courts.filter(c => c.id !== courtId);
        set({ courts: updatedCourts });

        if (state.selectedClub) {
            const updatedClub = { ...state.selectedClub, courts: updatedCourts };
            const updatedClubs = state.clubs.map(c =>
                c.id === state.selectedClub!.id ? updatedClub : c
            );
            set({
                clubs: updatedClubs,
                selectedClub: updatedClub,
                editedClubData: state.editedClubData
                    ? { ...state.editedClubData, courts: updatedCourts } as IClub
                    : null
            });
        }
    },
    setCourtToEdit: (court) => set({
        courtToEdit: court,
        courtFormData: court ? {
            name: court.name,
            cameraHost: court.cameraHost,
            cameraPort: court.cameraPort,
            cameraPath: court.cameraPath,
            rtspUsername: court.rtspUsername
        } : initialCourtFormData
    }),
    setCourtFormData: (data) => set((state) => ({
        courtFormData: { ...state.courtFormData, ...data }
    })),
    resetCourtFormData: () => set({ courtFormData: initialCourtFormData }),

    setIsOpenForm: (isOpen) => set({ isOpenForm: isOpen }),
    setIsOpenClubDetails: (isOpen) => set({ isOpenClubDetails: isOpen }),
    setIsOpenCourtForm: (isOpen) => set({ isOpenCourtForm: isOpen }),

    setIsLoadingClubs: (isLoading) => set({ isLoadingClubs: isLoading }),
    setIsLoadingPostClub: (isLoading) => set({ isLoadingPostClub: isLoading }),
    setIsLoadingUpdateClub: (isLoading) => set({ isLoadingUpdateClub: isLoading }),
    setIsLoadingDeleteClub: (isLoading) => set({ isLoadingDeleteClub: isLoading }),
    setIsLoadingUploadLogo: (isLoading) => set({ isLoadingUploadLogo: isLoading }),
    setIsLoadingUploadCover: (isLoading) => set({ isLoadingUploadCover: isLoading }),
    setIsLoadingDeleteLogo: (isLoading) => set({ isLoadingDeleteLogo: isLoading }),
    setIsLoadingDeleteCover: (isLoading) => set({ isLoadingDeleteCover: isLoading }),
    setIsLoadingPostCourt: (isLoading) => set({ isLoadingPostCourt: isLoading }),
    setIsLoadingUpdateCourt: (isLoading) => set({ isLoadingUpdateCourt: isLoading }),
    setIsLoadingDeleteCourt: (isLoading) => set({ isLoadingDeleteCourt: isLoading }),

    setErrorClubs: (error) => set({ errorClubs: error }),
    setErrorPostClub: (error) => set({ errorPostClub: error }),

    isClubDataChanged: () => {
        const state = get();
        if (!state.selectedClub || !state.editedClubData) return false;
        return JSON.stringify(state.selectedClub) !== JSON.stringify(state.editedClubData);
    },
    resetSelectedClub: () => set({
        selectedClub: null,
        editedClubData: null,
        courts: []
    })
}));

