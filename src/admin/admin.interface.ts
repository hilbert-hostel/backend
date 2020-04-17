import { GuestDetails } from '../auth/auth.interface'
import { Guest } from '../models/guest'
import { Staff } from '../models/staff'

export interface ReservationInfo {
    id: string
    checkIn: Date
    checkOut: Date
    specialRequests?: string
    guest?: GuestDetails
    rooms: ReservedRooms[]
}
export interface ReservationInfoDatabase {
    id: string
    check_in: Date
    check_out: Date
    specialRequests?: string
    guest: Guest
    rooms: ReservedRooms[]
}

export interface ReservedRooms {
    id: number
    price: number
    type: string
    description?: string
    beds: {
        id: number
    }[]
}

export type CreateStaff = Omit<Staff, 'id'>

export type StaffDetails = Omit<Staff, 'password'>

export interface RegisterStaffPayload {
    user: StaffDetails
    token: string
}

export type LoginStaffPayload = RegisterStaffPayload

export interface ListGuestsInput {
    page: number
    size: number
}

export interface CheckInInfo {
    id: string
    checkInTime: Date
    nights: number
    beds: number
    guest: GuestDetails
}

export interface CheckOutInfo {
    id: string
    checkOutTime: Date
    nights: number
    beds: number
    guest: GuestDetails
}

export interface CheckInOutSummary {
    checkIn: CheckInInfo[]
    checkOut: CheckOutInfo[]
}

export interface RoomInfo {
    id: number
    beds: {
        id: number
    }[]
}
export interface AdminRoomSearch {
    type: string
    description?: string
    price: number
    rooms: RoomInfo[]
}

export interface AdminCheckIn {
    reservationID: string
    date: Date
}

export type AdminCheckOut = AdminCheckIn
