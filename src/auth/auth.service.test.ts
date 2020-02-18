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
        async findOne({ username }) {
            const user = {
                id: '1234',
                username: 'username',
                email: 'email',
                password: await hash('password', 10),
                firstname: 'asd',
                lastname: 'asd'
            }
            return username === 'username' ? user : undefined
        },

        async findOneById(id) {
            const user = {
                id: '1234',
                username: 'username',
                email: 'email',
                password: await hash('password', 10),
                firstname: 'asd',
                lastname: 'asd'
            }
            return id === '1234' ? user : undefined
        }
    }
    const authService = new AuthService({ userRepository })
    test('register', async () => {
        const input: RegisterInput = {
            username: 'username',
            email: 'email',
            password: 'password',
            firstname: 'asd',
            lastname: 'asd'
        }
        const user = await authService.registerUser(input)
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
        test('wrong email', async () => {
            const input = {
                username: 'eyy',
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
                username: 'username',
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
                username: 'username',
                password: 'password'
            }
            const result = await authService.login(input)
            expect(result).toBeDefined()
        })
    })
})
