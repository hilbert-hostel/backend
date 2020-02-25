import { hash } from 'bcryptjs'
import { IUserRepository } from '../user/user.repository'
import { RegisterInput } from './auth.interface'
import { AuthService } from './auth.service'

describe('Auth Service', () => {
    const userRepository: IUserRepository = {
        async create(input) {
            return {
                id: '1234',
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
                address: 'Earth'
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
                address: 'Earth'
            }
            return id === '1234' ? user : undefined
        }
    }
    const authService = new AuthService({ userRepository })
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
