import { Room, RoomFacility } from '../models/room'
import { RoomPhoto } from '../models/roomPhoto'

export type Photo = Pick<RoomPhoto, 'photo_url' | 'photo_description'>
export interface RoomAvailability {
    id: number
    available: number
}
export interface RoomSearch {
    type: string
    description?: string
    price: number
    photos?: Photo[]
    facilities: RoomFacility[]
    availability: RoomAvailability[]
}
export interface RoomSuggestion {
    id: number
    type: string
    description?: string
    price: number
    photos?: Photo[]
    facilities?: RoomFacility[]
    guests: number
}
export interface RoomSearchPayload {
    rooms: RoomSearch[]
    suggestions: {
        lowestPrice: {
            roomConfig: RoomSuggestion[]
            totalPrice: number
        }[]
        lowestNumberOfRooms: {
            roomConfig: RoomSuggestion[]
            totalPrice: number
        }[]
    }
}
export interface RoomSearchInput {
    checkIn: string
    checkOut: string
    guests: number
}

export interface SelectedRoom {
    id: number
    guests: number
}
export interface RoomReservationInput {
    checkIn: string
    checkOut: string
    rooms: SelectedRoom[]
    specialRequests: string
}
export interface ReservedRoom extends Omit<Room, 'beds'> {
    beds: number
}
export interface ReservationDetail {
    id: string
    checkIn: Date
    checkOut: Date
    specialRequests?: string
    rooms: ReservedRoom[]
    isPaid: boolean
}

export interface UpdateReservationSpecialRequest {
    specialRequests: string
}
