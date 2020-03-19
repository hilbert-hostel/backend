import { User } from '../models/user'
import { CreateUser } from '../user/user.interface'

export type Token = string
export interface TokenPayload {
    userID: string
}

export interface RegisterInput extends Omit<CreateUser, 'national_id'> {
    nationalID: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface RegisterPayload {
    user: Omit<User, 'password'>
    token: string
}

export type LoginPayload = RegisterPayload

export interface VerifyUserInput {
    userID: string
    token: string
}
