import { randomNumString, isEmpty } from '.'

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

describe('is empty', () => {
    test('should be true', () => {
        expect(isEmpty(undefined)).toBe(true)
        expect(isEmpty(null)).toBe(true)
    })
    test('should be false', () => {
        expect(isEmpty('')).toBe(false)
        expect(isEmpty(0)).toBe(false)
        expect(isEmpty(NaN)).toBe(false)
    })
})
