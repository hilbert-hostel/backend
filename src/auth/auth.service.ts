import { compare, hash } from 'bcryptjs'
import { Config } from '../config'
import { Dependencies } from '../container'
import { IMailService } from '../email/email.service'
import { BadRequestError } from '../error/HttpError'
import { User } from '../models/user'
import { VerificationToken } from '../models/verificationToken'
import { IUserRepository } from '../user/user.repository'
import { LoginInput, RegisterInput } from './auth.interface'
import { randomNumString } from './auth.utils'
import { IVerificationTokenRepository } from './verificationToken.repository'

export interface IAuthService {
    registerUser(input: RegisterInput): Promise<User>
    login(input: LoginInput): Promise<User>
    createVerificationToken(userID: string): Promise<VerificationToken>
    verifyUser(userID: string, token: string): Promise<User>
    sendVerificationEmail(user: User, token: string): Promise<any>
}

export class AuthService implements IAuthService {
    private readonly userRepository: IUserRepository
    private readonly verificationTokenRepository: IVerificationTokenRepository
    private readonly mailService: IMailService
    private readonly config: Config
    constructor({
        userRepository,
        verificationTokenRepository,
        mailService,
        config
    }: Dependencies<
        IUserRepository | IVerificationTokenRepository | IMailService | Config
    >) {
        this.userRepository = userRepository
        this.verificationTokenRepository = verificationTokenRepository
        this.mailService = mailService
        this.config = config
    }

    sendVerificationEmail(user: User, token: string) {
        const { email, id } = user
        const link = `${this.config.BASE_URL}/verify?userID=${id}&token=${token}`
        return this.mailService.sendMail({
            to: email,
            subject: `Hilbert Account Email Verification`,
            text: `Welcome to Hilbert! Please verify your account by clicking on the link below.
${link}`
        })
    }
    createVerificationToken(user_id: string) {
        const token = randomNumString(6)
        return this.verificationTokenRepository.create({ token, user_id })
    }

    async verifyUser(user_id: string, token: string) {
        const user = await this.userRepository.findOneById(user_id)
        if (!user)
            throw new BadRequestError(
                'Verification failed. User ID or token is invalid.'
            )
        const verificationToken = await this.verificationTokenRepository.findOne(
            { user_id, token }
        )
        if (!verificationToken)
            throw new BadRequestError(
                'Verification failed. User ID or token is invalid.'
            )
        return this.userRepository.updateOneById(user_id, {
            is_verified: true
        }) as Promise<User>
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
