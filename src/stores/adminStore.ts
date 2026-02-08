import { create } from 'zustand';
import type { ClubWithCourts, IClub, ICourt, IUser, UserWithClubs } from '../types';

interface AdminState {
    clubs: ClubWithCourts[];
    selectedClub: ClubWithCourts | null;
    editedClubData: IClub | null;

    courts: ICourt[];
    courtToEdit: ICourt | null;
    courtFormData: Partial<ICourt & { rtspPassword: string }>;

    users: UserWithClubs[]
    userSelected: UserWithClubs | null
    editedUserData: UserWithClubs | null

    isOpenForm: boolean;
    isOpenClubDetails: boolean;
    isOpenCourtForm: boolean;
    isOpenUserForm: boolean;
    isOpenUserDetailsForm: boolean;

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
    isLoadingPostUser: boolean;
    isLoadingGetUsers: boolean
    isLoadingUpdateUser: boolean
    isLoadingDeleteUser: boolean;
    isLoadingChangeTheme: boolean;

    errorClubs: Error | null;
    errorPostClub: Error | null;

    setClubs: (clubs: ClubWithCourts[]) => void;
    addClub: (club: IClub) => void;
    updateClub: (club: ClubWithCourts) => void;
    deleteClub: (clubId: string) => void;
    setSelectedClub: (club: ClubWithCourts | null) => void;
    setEditedClubData: (data: IClub | null) => void;
    updateClubInList: (club: IClub) => void;

    setCourts: (courts: ICourt[]) => void;
    addCourt: (court: ICourt) => void;
    updateCourt: (court: ICourt) => void;
    deleteCourt: (courtId: string) => void;
    setCourtToEdit: (court: ICourt | null) => void;
    setCourtFormData: (data: Partial<ICourt & { rtspPassword: string }>) => void;
    resetCourtFormData: () => void;

    setUsers: (users: UserWithClubs[]) => void
    addUser: (user: IUser) => void
    updateUser: (user: IUser) => void
    deleteUser: (userId: string) => void;
    addClubTouser: (club: IClub, userId: string) => void
    removeClubFromUser: (clubId: string, userId: string) => void
    setSelectedUser: (user: UserWithClubs | null) => void
    setEditedUserData: (data: IUser | null) => void

    setIsOpenForm: (isOpen: boolean) => void;
    setIsOpenClubDetails: (isOpen: boolean) => void;
    setIsOpenCourtForm: (isOpen: boolean) => void;
    setIsOpenUserForm: (isOpen: boolean) => void;
    setIsOpenUserDetailsForm: (isOpen: boolean) => void;

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
    setIsLoadingPostUser: (isLoading: boolean) => void;
    setIsLoadingGetUsers: (isLoading: boolean) => void;
    setIsLoadingUpdateUser: (isLoading: boolean) => void;
    setIsLoadingDeleteUser: (isLoading: boolean) => void;
    setIsLoadingChangeTheme: (isLoading: boolean) => void;

    setErrorClubs: (error: Error | null) => void;
    setErrorPostClub: (error: Error | null) => void;

    isClubDataChanged: () => boolean;
    isUserDataChanged: () => boolean;
    resetSelectedClub: () => void;
    resetSelectedUser: () => void;
}

const initialCourtFormData: Partial<ICourt & { rtspPassword: string }> = {
    name: "",
    cameraHost: "",
};

export const useAdminStore = create<AdminState>((set, get) => ({
    clubs: [],
    selectedClub: null,
    editedClubData: null,
    courts: [],
    courtToEdit: null,
    courtFormData: initialCourtFormData,
    users: [],
    userSelected: null,
    editedUserData: null,
    isOpenForm: false,
    isOpenClubDetails: false,
    isOpenCourtForm: false,
    isOpenUserForm: false,
    isOpenUserDetailsForm: false,
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
    isLoadingPostUser: false,
    isLoadingGetUsers: false,
    isLoadingUpdateUser: false,
    isLoadingDeleteUser: false,
    isLoadingChangeTheme: false,
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
        } : initialCourtFormData
    }),
    setCourtFormData: (data) => set((state) => ({
        courtFormData: { ...state.courtFormData, ...data }
    })),
    resetCourtFormData: () => set({ courtFormData: initialCourtFormData }),

    setUsers: (users) => set({ users }),
    addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, clubs: [] }]
    })),
    updateUser: (user) => {
        const state = get();
        const updatedUsers = state.users.map(u => u.id === user.id ? { ...u, ...user } : u);
        set({
            users: updatedUsers,
            userSelected: state.userSelected?.id === user.id
                ? { ...state.userSelected, ...user }
                : state.userSelected,
            editedUserData: state.editedUserData?.id === user.id
                ? { ...state.editedUserData, ...user }
                : state.editedUserData
        });
    },
    addClubTouser: (club: IClub, userId: string) => {
        const state = get();
        const updatedUsers = state.users.map(u => u.id === userId ? { ...u, clubs: [...u.clubs!, club] } : u)
        set({
            users: updatedUsers,
            userSelected: state.userSelected?.id === userId
                ? { ...state.userSelected, clubs: [...state.userSelected.clubs!, club] }
                : state.userSelected,
        });

    },
    removeClubFromUser: (clubId: string, userId: string) => {
        const state = get();
        const updatedUsers = state.users.map(u =>
            u.id === userId
                ? { ...u, clubs: u.clubs ? u.clubs.filter(c => c.id !== clubId) : [] }
                : u
        );
        set({
            users: updatedUsers,
            userSelected: state.userSelected?.id === userId
                ? {
                    ...state.userSelected,
                    clubs: state.userSelected.clubs ? state.userSelected.clubs.filter(c => c.id !== clubId) : []
                }
                : state.userSelected,
        });
    },
    deleteUser: (userId) => set((state) => ({
        users: state.users.filter(u => u.id !== userId),
        userSelected: state.userSelected?.id === userId ? null : state.userSelected,
        editedUserData: state.editedUserData?.id === userId ? null : state.editedUserData
    })),
    setSelectedUser: (user) => set({
        userSelected: user,
        editedUserData: user ? { ...user } : null,
    }),
    setEditedUserData: (data) => set({ editedUserData: data }),


    setIsOpenForm: (isOpen) => set({ isOpenForm: isOpen }),
    setIsOpenClubDetails: (isOpen) => set({ isOpenClubDetails: isOpen }),
    setIsOpenCourtForm: (isOpen) => set({ isOpenCourtForm: isOpen }),
    setIsOpenUserForm: (isOpen) => set({ isOpenUserForm: isOpen }),
    setIsOpenUserDetailsForm: (isOpen) => set({ isOpenUserDetailsForm: isOpen }),

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
    setIsLoadingPostUser: (isLoading) => set({ isLoadingPostUser: isLoading }),
    setIsLoadingGetUsers: (isLoading) => set({ isLoadingGetUsers: isLoading }),
    setIsLoadingUpdateUser: (isLoading) => set({ isLoadingUpdateUser: isLoading }),
    setIsLoadingDeleteUser: (isLoading) => set({ isLoadingDeleteUser: isLoading }),
    setIsLoadingChangeTheme: (isLoading) => set({ isLoadingChangeTheme: isLoading }),

    setErrorClubs: (error) => set({ errorClubs: error }),
    setErrorPostClub: (error) => set({ errorPostClub: error }),

    isClubDataChanged: () => {
        const state = get();
        if (!state.selectedClub || !state.editedClubData) return false;
        const omitTheme = (club: any) => {
            if (!club) return club;
            const { theme, ...rest } = club;
            return rest;
        };
        return JSON.stringify(omitTheme(state.selectedClub)) !== JSON.stringify(omitTheme(state.editedClubData));
    },
    resetSelectedClub: () => set({
        selectedClub: null,
        editedClubData: null,
        courts: []
    }),
    isUserDataChanged: () => {
        const state = get();
        if (!state.userSelected || !state.editedUserData) return false;
        const omitClubs = (user: any) => {
            if (!user) return user;
            const { clubs, ...rest } = user;
            return rest;
        };
        return JSON.stringify(omitClubs(state.userSelected)) !== JSON.stringify(omitClubs(state.editedUserData));
    },
    resetSelectedUser: () => set({
        userSelected: null,
        editedUserData: null,
    })
}));

