import { makeGenerateJWT, makeVerifyJWT } from './auth.service'

test('jwt', async () => {
    const fakeConfig = {
        config: {
            SECRET: '1234'
        }
    } as any

    const jwt = await makeGenerateJWT(fakeConfig)({
        id: '1234',
        email: 'asdf',
        password: 'password',
        firstname: 'name',
        lastname: 'name'
    })
    expect(typeof jwt).toBe('string')
    const decoded = await makeVerifyJWT(fakeConfig)(jwt)
    expect(decoded.userID).toBe('1234')
})
