import { JwtService } from './jwt.service'
test('jwt', async () => {
    expect.assertions(4)
    const fakeConfig = {
        config: {
            SECRET: '1234'
        }
    } as any
    const jwtService = new JwtService(fakeConfig)
    const jwt = await jwtService.generateToken(
        '1234',
        'hello@email.com',
        'GUEST'
    )
    expect(typeof jwt).toBe('string')
    const decoded = await jwtService.verifyToken(jwt)
    expect(decoded.userID).toBe('1234')
    expect(decoded.email).toBe('hello@email.com')
    expect(decoded.role).toBe('GUEST')
})
