import { compare, hash } from 'bcryptjs'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { User } from '../models/user'
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
        const { nationalID, ...rest } = input
        const user = await this.userRepository.create({
            ...rest,
            national_id: nationalID,
            password: hashed
        })
        return user
    }

    async login(input: LoginInput) {
        const user = await this.userRepository.findOne({
            email: input.email
        })
        if (!user) throw new BadRequestError('Wrong email or password.')
        const correct = await compare(input.password, user.password)
        if (!correct) throw new BadRequestError('Wrong email or password.')
        return user
    }
}
