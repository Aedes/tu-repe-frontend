export interface Theme {
    primary: string
    secondary: string
    background: string
}

export interface IClub {
    id?: string;
    name: string;
    openTime: string;
    closeTime: string;
    appointmentDuration: number;
    country: string;
    province: string;
    city: string;
    address: string;
    urlId: string,
    phone?: string;
    instagramHandle?: string;
    description?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    profileImagePublicId?: string;
    coverImagePublicId?: string;
    theme?: Theme
}

export interface ICourt {
    id?: string;
    clubId: number;
    name: string;
    cameraHost: string;
    cameraPath: string;
}

export interface IVideo {
    id?: string;
    courtId: number;
    fileName: string;
    startTime: Date;
    endTime: Date;
    b2FilePath: string;
}

export interface ClubWithCourts extends IClub {
    courts: ICourt[];
}

export interface IUser {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
}

export interface UserWithClubs extends IUser {
    clubs?: IClub[]
}