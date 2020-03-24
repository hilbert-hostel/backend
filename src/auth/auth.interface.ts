import { CreateGuest } from '../guest/guest.interface'
import { Guest } from '../models/guest'

export type Token = string
export interface TokenPayload {
    userID: string
}

export interface RegisterInput extends Omit<CreateGuest, 'national_id'> {
    nationalID: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface RegisterPayload {
    user: Omit<Guest, 'password'>
    token: string
}

export type LoginPayload = RegisterPayload

export interface VerifyUserInput {
    userID: string
    token: string
}
