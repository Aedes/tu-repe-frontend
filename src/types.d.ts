export interface IClub {
    id?: number;
    name: string;
    openTime: string;
    closeTime: string;
    appointmentDuration: number;
    country: string;
    province: string;
    city: string;
    address: string;
    phone?: string;
    instagramHandle?: string;
    description?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    profileImagePublicId?: string;
    coverImagePublicId?: string;
}

export interface ICourt {
    id?: number;
    clubId: number;
    name: string;
    rtspUrl: string;
}

export interface IVideo {
    id?: number;
    courtId: number;
    fileName: string;
    startTime: Date;
    endTime: Date;
    b2FilePath: string;
}

export interface ClubWithCourts extends IClub {
    courts: ICourt[];
}
