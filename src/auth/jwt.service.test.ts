import { JwtService } from './jwt.service'
test('jwt', async () => {
    const fakeConfig = {
        config: {
            SECRET: '1234'
        }
    } as any
    const jwtService = new JwtService(fakeConfig)
    const jwt = await jwtService.generateToken({
        id: '1234',
        email: 'asdf',
        password: 'password',
        firstname: 'name',
        lastname: 'name',
        phone: '0812345678',
        address: 'Earth'
    })
    expect(typeof jwt).toBe('string')
    const decoded = await jwtService.verifyToken(jwt)
    expect(decoded.userID).toBe('1234')
})
