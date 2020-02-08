import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Dependencies } from '../container'
import { User, UserModel } from '../models/user.model'
import { LoginInput, RegisterInput, Token } from './auth.interface'

const hashPassword = (password: string) => bcrypt.hash(password, 10)
const comparePassowrd = bcrypt.compare

export type GenerateJWT = (user: User) => Promise<string>
export const makeGenerateJWT = ({ config }: Dependencies): GenerateJWT => (
    user: User
) =>
    new Promise((resolve, reject) => {
        jwt.sign({ userID: user.id } as Token, config.SECRET, (err, token) =>
            err ? reject(err) : resolve(token)
        )
    })

export type VerifyJWT = (token: string) => Promise<Token>
export const makeVerifyJWT = ({ config }: Dependencies): VerifyJWT => (
    token: string
) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET, (err, token) =>
            err ? reject(err) : resolve(token as Token)
        )
    })

export type CreateUser = (
    input: RegisterInput
) => Promise<{ user: User; token: string }>
export const makeCreateUser = ({
    generateJWT
}: Dependencies): CreateUser => async (input: RegisterInput) => {
    const hashed = await hashPassword(input.password)
    const user = await UserModel.query().insert({
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
export const makeLogin = ({ generateJWT }: Dependencies) => async (
    login: LoginInput
) => {
    const user = await UserModel.query().findOne({ email: login.email })
    if (!user) throw new Error('Wrong email or password')
    const correct = comparePassowrd(login.password, user.password)
    if (!correct) throw new Error('Wrong email or password')
    return {
        user,
        token: await generateJWT(user)
    }
}
