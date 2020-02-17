import { compare, hash } from 'bcryptjs'
import { Dependencies } from '../container'
import { User } from '../models/user.model'
import { IUserRepository } from '../user/user.repository'
import { LoginInput, RegisterInput } from './auth.interface'

export interface IAuthService {
    registerUser(input: RegisterInput): Promise<User>
    login(input: LoginInput): Promise<User>
}
export class AuthService implements IAuthService {
    private readonly userRepository: IUserRepository
    constructor({ userRepository }: Dependencies<IUserRepository>) {
        this.userRepository = userRepository
    }
    async registerUser(input: RegisterInput) {
        const hashed = await hash(input.password, 10)
        const user = await this.userRepository.create({
            ...input,
            password: hashed
        })
        return user
    }

    async login(input: LoginInput) {
        const user = await this.userRepository.findOne({ email: input.email })
        if (!user) throw new Error('Wrong email or password.')
        const correct = compare(input.password, user.password)
        if (!correct) throw new Error('Wrong email or password.')
        return user
    }
}
