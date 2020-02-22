export interface RoomSearchPayload {
    type: string
    description?: string
    available: number
    price: number
    photo?: string
    facilities?: string[]
}

export interface RoomSearchInput {
    checkIn: string
    checkOut: string
    guests: number
}
