import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user.model'
import { Service } from '../types'
import { LoginInput, RegisterInput, Token } from './auth.interface'

const hashPassword = (password: string) => bcrypt.hash(password, 10)
const comparePassowrd = bcrypt.compare

export type GenerateJWT = (user: User) => Promise<string>
export const makeGenerateJWT: Service<GenerateJWT> = ({ config }) => user =>
    new Promise((resolve, reject) => {
        jwt.sign({ userID: user.id } as Token, config.SECRET, (err, token) =>
            err ? reject(err) : resolve(token)
        )
    })

export type VerifyJWT = (token: string) => Promise<Token>
export const makeVerifyJWT: Service<VerifyJWT> = ({ config }) => token =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET, (err, token) =>
            err ? reject(err) : resolve(token as Token)
        )
    })

export type RegisterUser = (
    input: RegisterInput
) => Promise<{ user: User; token: string }>
export const makeRegisterUser: Service<RegisterUser> = ({
    generateJWT,
    userRepository
}) => async input => {
    const hashed = await hashPassword(input.password)
    const user = await userRepository.create({
        ...input,
        password: hashed
    })
    return {
        user,
        token: await generateJWT(user)
    }
}

export type Login = (
    input: LoginInput
) => Promise<{ user: User; token: string }>
export const makeLogin: Service<Login> = ({
    generateJWT,
    userRepository
}) => async login => {
    const user = await userRepository.findOne({ email: login.email })
    if (!user) throw new Error('Wrong email or password.')
    const correct = comparePassowrd(login.password, user.password)
    if (!correct) throw new Error('Wrong email or password.')
    return {
        user,
        token: await generateJWT(user)
    }
}
