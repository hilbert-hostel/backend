import { hash } from 'bcryptjs'
import { IUserRepository } from '../user/user.repository'
import { RegisterInput } from './auth.interface'
import { AuthService } from './auth.service'
import { IJwtService } from './jwt.service'

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
                phone: 'asd',
                address: 'zxc'
            }
            return email === 'email' ? user : undefined
        }
    }
    const jwtService: IJwtService = {
        async generateToken() {
            return 'token'
        },
        async verifyToken() {
            return {} as any
        }
    }
    const authService = new AuthService({ userRepository, jwtService })
    test('register', async () => {
        const input: RegisterInput = {
            email: 'email',
            password: 'password',
            firstname: 'asd',
            lastname: 'asd',
            phone: 'asd',
            address: 'zxc'
        }
        const { user } = await authService.registerUser(input)
        expect(user.password).toEqual(expect.any(String))
        expect(user.password).not.toEqual(input.password)
        expect(user).toEqual({
            ...input,
            id: expect.any(String),
            password: expect.any(String)
        })
    })
    describe('login', () => {
        expect.assertions(3)
        test('wrong email', () => {
            const input = {
                email: 'eyy',
                password: 'password'
            }
            expect(authService.login(input)).rejects.toThrow()
        })
        test('wrong password', () => {
            const input = {
                email: 'email',
                password: 'asd'
            }
            expect(authService.login(input)).rejects.toThrow()
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
