import { hash } from 'bcryptjs'
import { config } from '../config'
import { IMailService } from '../email/email.service'
import { IUserRepository } from '../user/user.repository'
import { RegisterInput } from './auth.interface'
import { AuthService } from './auth.service'
import { IVerificationTokenRepository } from './verificationToken.repository'

describe('Auth Service', () => {
    const userRepository: IUserRepository = {
        async create(input) {
            return {
                id: '1234',
                is_verified: false,
                ...input
            }
        },
        async findOne({ email }) {
            const user = {
                id: '1234',
                email: 'email',
                password: await hash('password', 10),
                firstname: 'asd',
                lastname: 'asd',
                national_id: '1234567890123',
                phone: '0801234567',
                address: 'Earth',
                is_verified: false
            }
            return email === 'email' ? user : undefined
        },

        async findOneById(id) {
            const user = {
                id: '1234',
                email: 'email',
                password: await hash('password', 10),
                firstname: 'asd',
                lastname: 'asd',
                national_id: '1234567890123',
                phone: '0801234567',
                address: 'Earth',
                is_verified: false
            }
            return id === '1234' ? user : undefined
        },

        async updateOneById(id, update) {
            const user = {
                id: '1234',
                email: 'email',
                password: await hash('password', 10),
                firstname: 'asd',
                lastname: 'asd',
                national_id: '1234567890123',
                phone: '0801234567',
                address: 'Earth',
                is_verified: false
            }
            return id === '1234' ? { ...user, ...update } : undefined
        }
    }
    const verificationTokenRepository: IVerificationTokenRepository = {
        async create({ user_id, token }) {
            return {
                id: '12345',
                user_id,
                token
            }
        },
        async findOne({ user_id, token }) {
            const t = {
                id: '12345',
                user_id,
                token
            }
            return t.user_id === user_id && t.token === token ? t : undefined
        }
    }
    const mailService: IMailService = {
        async sendMail() {}
    }
    const authService = new AuthService({
        userRepository,
        verificationTokenRepository,
        config,
        mailService
    })
    test('register', async () => {
        const input: RegisterInput = {
            email: 'email',
            password: 'password',
            firstname: 'asd',
            lastname: 'asd',
            nationalID: '1234567890123',
            phone: '0801234567',
            address: 'Earth'
        }
        const user = await authService.registerUser(input)
        expect(user.password).toEqual(expect.any(String))
        expect(user.password).not.toEqual(input.password)
        expect(user).toEqual({
            email: 'email',
            firstname: 'asd',
            lastname: 'asd',
            national_id: '1234567890123',
            phone: '0801234567',
            address: 'Earth',
            id: expect.any(String),
            password: expect.any(String)
        })
    })
    describe('login', () => {
        expect.assertions(3)
        test('wrong email', async () => {
            const input = {
                email: 'eyy',
                password: 'password'
            }
            try {
                await authService.login(input)
            } catch (e) {
                expect(e).toBeDefined()
            }
        })
        test('wrong password', async () => {
            const input = {
                email: 'email',
                password: 'asd'
            }
            try {
                await authService.login(input)
            } catch (e) {
                expect(e).toBeDefined()
            }
        })
        test('correct', async () => {
            const input = {
                email: 'email',
                password: 'password'
            }
            const result = await authService.login(input)
            expect(result).toBeDefined()
        })
    })
})
