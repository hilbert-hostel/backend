import { compare, hash } from 'bcryptjs'
import { Config } from '../config'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { IGuestRepository } from '../guest/guest.repository'
import { IMailService } from '../mail/mail.service'
import { Guest } from '../models/guest'
import { VerificationToken } from '../models/verificationToken'
import { randomNumString } from '../utils'
import { LoginInput, RegisterInput } from './auth.interface'
import { IVerificationTokenRepository } from './verificationToken.repository'

export interface IAuthService {
    registerUser(input: RegisterInput): Promise<Guest>
    login(input: LoginInput): Promise<Guest>
    createVerificationToken(guestID: string): Promise<VerificationToken>
    verifyGuest(guestID: string, token: string): Promise<Guest>
    sendVerificationEmail(user: Guest, token: string): Promise<any>
}

export class AuthService implements IAuthService {
    private readonly guestRepository: IGuestRepository
    private readonly verificationTokenRepository: IVerificationTokenRepository
    private readonly mailService: IMailService
    private readonly config: Config
    constructor({
        guestRepository,
        verificationTokenRepository,
        mailService,
        config
    }: Dependencies<
        IGuestRepository | IVerificationTokenRepository | IMailService | Config
    >) {
        this.guestRepository = guestRepository
        this.verificationTokenRepository = verificationTokenRepository
        this.mailService = mailService
        this.config = config
    }

    sendVerificationEmail(user: Guest, token: string) {
        const { email, id } = user
        const link = `${this.config.BASE_URL}/verify?userID=${id}&token=${token}`
        return this.mailService.sendMail({
            to: email,
            subject: `Hilbert Account Email Verification`,
            text: `Welcome to Hilbert! Please verify your account by clicking on the link below.
${link}`
        })
    }

    createVerificationToken(guest_id: string) {
        const token = randomNumString(6)
        return this.verificationTokenRepository.create({
            token,
            guest_id
        })
    }

    async verifyGuest(guest_id: string, token: string) {
        const user = await this.guestRepository.findOneById(guest_id)
        if (!user)
            throw new BadRequestError(
                'Verification failed. User ID or token is invalid.'
            )
        const verificationToken = await this.verificationTokenRepository.findOne(
            { guest_id, token }
        )
        if (!verificationToken)
            throw new BadRequestError(
                'Verification failed. User ID or token is invalid.'
            )
        return this.guestRepository.updateOneById(guest_id, {
            is_verified: true
        }) as Promise<Guest>
    }

    async registerUser(input: RegisterInput) {
        const hashed = await hash(input.password, 10)
        const { nationalID, ...rest } = input
        const user = await this.guestRepository.create({
            ...rest,
            national_id: nationalID,
            password: hashed
        })
        return user
    }

    async login(input: LoginInput) {
        const user = await this.guestRepository.findOne({
            email: input.email
        })
        if (!user) throw new BadRequestError('Wrong email or password.')
        const correct = await compare(input.password, user.password)
        if (!correct) throw new BadRequestError('Wrong email or password.')
        return user
    }
}
