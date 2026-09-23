import type { IClub } from "../types"

const textOrEmpty = (value: string | null | undefined) => value ?? ""

export const toClubWriteDto = (data: Partial<IClub>) => ({
    name: data.name,
    openTime: data.openTime,
    closeTime: data.closeTime,
    appointmentDuration: data.appointmentDuration,
    country: data.country,
    province: data.province,
    city: data.city,
    address: data.address,
    phone: textOrEmpty(data.phone),
    instagramHandle: textOrEmpty(data.instagramHandle),
    description: textOrEmpty(data.description),
})
