import { CreateGuest } from '../guest/guest.interface'

export type Token = string
export interface TokenPayload {
    userID: string
    email: string
    role: string
}

export interface RegisterInput extends Omit<CreateGuest, 'national_id'> {
    nationalID: string
}

export interface GuestDetails {
    id: string
    email: string
    firstname: string
    lastname: string
    nationalID: string
    phone: string
    address: string
}
export interface LoginInput {
    email: string
    password: string
}

export interface RegisterPayload {
    user: GuestDetails
    token: string
}

export type LoginPayload = RegisterPayload

export interface VerifyUserInput {
    userID: string
    token: string
}
