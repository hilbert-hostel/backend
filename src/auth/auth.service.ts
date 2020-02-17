import { compare, hash } from 'bcryptjs'
import { Dependencies } from '../container'
import { IUserRepository } from '../user/user.repository'
import {
    LoginInput,
    LoginPayload,
    RegisterInput,
    RegisterPayload
} from './auth.interface'
import { IJwtService } from './jwt.service'

export interface IAuthService {
    registerUser(input: RegisterInput): Promise<RegisterPayload>
    login(input: LoginInput): Promise<LoginPayload>
}
export class AuthService implements IAuthService {
    private readonly userRepository: IUserRepository
    private readonly jwtService: IJwtService
    constructor({
        userRepository,
        jwtService
    }: Dependencies<IUserRepository | IJwtService>) {
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
