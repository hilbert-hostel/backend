import { RoomFacility } from '../models/room'

export interface RoomSearchPayload {
    type: string
    description?: string
    available: number
    price: number
    photo?: string
    facilities?: RoomFacility[]
}

export interface RoomSearchInput {
    checkIn: string
    checkOut: string
    guests: number
}
