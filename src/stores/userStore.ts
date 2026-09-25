import { create } from "zustand";
import type { ClubWithCourts, IClub, ICourt, IUser, Theme } from "../types";

const withoutTheme = <T extends { theme?: Theme }>(club: T) => {
    const copy = { ...club }
    delete copy.theme
    return copy
}

interface UserState {
    user: Omit<IUser, "passwordHash"> | null

    clubs: ClubWithCourts[]
    selectedClub: ClubWithCourts | null;
    editedClubData: IClub | null;

    courts: ICourt[];
    courtToEdit: ICourt | null;
    courtFormData: Partial<ICourt & { rtspPassword: string }>;

    isOpenClubForm: boolean;
    isOpenCourtForm: boolean;

    isLoadingClubs: boolean;
    isLoadingUpdateClub: boolean;
    isLoadingUploadLogo: boolean;
    isLoadingUploadCover: boolean;
    isLoadingDeleteLogo: boolean;
    isLoadingDeleteCover: boolean;
    isLoadingUpdateCourt: boolean;
    isLoadingChangeTheme: boolean;

    setUser: (user: Omit<IUser, "passwordHash">) => void

    setClubs: (clubs: ClubWithCourts[]) => void;
    updateClub: (club: ClubWithCourts) => void;
    setSelectedClub: (club: ClubWithCourts | null) => void;
    setEditedClubData: (data: IClub | null) => void;

    setCourts: (courts: ICourt[]) => void;
    updateCourt: (court: ICourt) => void;
    setCourtToEdit: (court: ICourt | null) => void;
    setCourtFormData: (data: Partial<ICourt & { rtspPassword: string }>) => void;
    resetCourtFormData: () => void;

    setIsOpenClubForm: (isOpen: boolean) => void;
    setIsOpenCourtForm: (isOpen: boolean) => void;

    setIsLoadingClubs: (isLoading: boolean) => void;
    setIsLoadingUpdateClub: (isLoading: boolean) => void;
    setIsLoadingUploadLogo: (isLoading: boolean) => void;
    setIsLoadingUploadCover: (isLoading: boolean) => void;
    setIsLoadingDeleteLogo: (isLoading: boolean) => void;
    setIsLoadingDeleteCover: (isLoading: boolean) => void;
    setIsLoadingUpdateCourt: (isLoading: boolean) => void;
    setIsLoadingChangeTheme: (isLoading: boolean) => void;

    isClubDataChanged: () => boolean;
    resetSelectedClub: () => void;
}

const initialCourtFormData: Partial<ICourt & { rtspPassword: string }> = {
    name: "",
};

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    clubs: [],
    selectedClub: null,
    editedClubData: null,
    courts: [],
    courtToEdit: null,
    courtFormData: initialCourtFormData,

    isOpenClubForm: false,
    isOpenCourtForm: false,

    isLoadingClubs: false,
    isLoadingUpdateClub: false,
    isLoadingUploadLogo: false,
    isLoadingUploadCover: false,
    isLoadingDeleteLogo: false,
    isLoadingDeleteCover: false,
    isLoadingUpdateCourt: false,
    isLoadingChangeTheme: false,

    setUser: (user) => set({ user }),

    setClubs: (clubs) => set({ clubs }),
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
    setSelectedClub: (club) => set({
        selectedClub: club,
        editedClubData: club ? { ...club } : null,
        courts: club?.courts || []
    }),
    setEditedClubData: (data) => set({ editedClubData: data }),

    setCourts: (courts) => set({ courts }),
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
    setCourtToEdit: (court) => set({
        courtToEdit: court,
        courtFormData: court ? {
            name: court.name,
            cameraHost: court.cameraHost,
        } : initialCourtFormData
    }),
    setCourtFormData: (data) => set((state) => ({
        courtFormData: { ...state.courtFormData, ...data }
    })),
    resetCourtFormData: () => set({ courtFormData: initialCourtFormData }),

    setIsOpenClubForm: (isOpen) => set({ isOpenClubForm: isOpen }),
    setIsOpenCourtForm: (isOpen) => set({ isOpenCourtForm: isOpen }),

    setIsLoadingClubs: (isLoading) => set({ isLoadingClubs: isLoading }),
    setIsLoadingUpdateClub: (isLoading) => set({ isLoadingUpdateClub: isLoading }),
    setIsLoadingUploadLogo: (isLoading) => set({ isLoadingUploadLogo: isLoading }),
    setIsLoadingUploadCover: (isLoading) => set({ isLoadingUploadCover: isLoading }),
    setIsLoadingDeleteLogo: (isLoading) => set({ isLoadingDeleteLogo: isLoading }),
    setIsLoadingDeleteCover: (isLoading) => set({ isLoadingDeleteCover: isLoading }),
    setIsLoadingUpdateCourt: (isLoading) => set({ isLoadingUpdateCourt: isLoading }),
    setIsLoadingChangeTheme: (isLoading) => set({ isLoadingChangeTheme: isLoading }),

    isClubDataChanged: () => {
        const state = get();
        if (!state.selectedClub || !state.editedClubData) return false;
        return JSON.stringify(withoutTheme(state.selectedClub)) !== JSON.stringify(withoutTheme(state.editedClubData));
    },
    resetSelectedClub: () => set({
        selectedClub: null,
        editedClubData: null,
        courts: []
    }),
}))