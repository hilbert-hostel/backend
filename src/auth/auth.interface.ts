import { CreateUser } from '../user/user.interface'

export interface Token {
    userID: string
}

export type RegisterInput = CreateUser

export interface LoginInput {
    email: string
    password: string
}
