import { JwtService } from './jwt.service'
test('jwt', async () => {
    expect.assertions(2)
    const fakeConfig = {
        config: {
            SECRET: '1234'
        }
    } as any
    const jwtService = new JwtService(fakeConfig)
    const jwt = await jwtService.generateToken({
        id: '1234',
        username: 'asdf',
        email: 'email',
        password: 'password',
        firstname: 'name',
        lastname: 'name'
    })
    expect(typeof jwt).toBe('string')
    const decoded = await jwtService.verifyToken(jwt)
    expect(decoded.userID).toBe('1234')
})
