import { compare, hash } from 'bcryptjs'
import { Dependencies } from '../container'
import { User } from '../models/user.model'
import { IUserRepository } from '../user/user.repository'
import { LoginInput, RegisterInput } from './auth.interface'
import { IJwtService } from './jwt.service'

export interface IAuthService {
    registerUser(input: RegisterInput): Promise<{ user: User; token: string }>
    login(input: LoginInput): Promise<{ user: User; token: string }>
}
export class AuthService implements IAuthService {
    private readonly userRepository: IUserRepository
    private readonly jwtService: IJwtService
    constructor({ userRepository, jwtService }: Dependencies) {
        this.userRepository = userRepository
        this.jwtService = jwtService
    }
    async registerUser(input: RegisterInput) {
        const hashed = await hash(input.password, 10)
        const user = await this.userRepository.create({
            ...input,
            password: hashed
        })
        return {
            user,
            token: await this.jwtService.generateToken(user)
        }
    }

    async login(input: LoginInput) {
        const user = await this.userRepository.findOne({ email: input.email })
        if (!user) throw new Error('Wrong email or password.')
        const correct = compare(input.password, user.password)
        if (!correct) throw new Error('Wrong email or password.')
        return {
            user,
            token: await this.jwtService.generateToken(user)
        }
    }
}
