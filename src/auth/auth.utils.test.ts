import { randomNumString } from './auth.utils'

describe('random num string', () => {
    test('correct length', () => {
        expect(randomNumString(1).length).toBe(1)
        expect(randomNumString(2).length).toBe(2)
        expect(randomNumString(3).length).toBe(3)
        expect(randomNumString(4).length).toBe(4)
    })
    test('is number', () => {
        expect(randomNumString(5)).toMatch(/^\d+$/)
    })
    test('no negative length', () => {
        expect(() => randomNumString(-1)).toThrow()
    })
})
