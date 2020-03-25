import { RoomFacility } from '../models/room'
import { RoomPhoto } from '../models/roomPhoto'

export type Photo = Pick<RoomPhoto, 'photo_url' | 'photo_description'>
export interface RoomAvailability {
    id: number
    available: number
}
export interface RoomSearchPayload {
    type: string
    description?: string
    price: number
    photos?: Photo[]
    facilities?: RoomFacility[]
    availability: RoomAvailability[]
}

export interface RoomSearchInput {
    checkIn: string
    checkOut: string
    guests: number
}
