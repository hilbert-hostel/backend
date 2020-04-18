import moment from 'moment'
import { sameDay } from './checkIn.utils'

describe('test same day', () => {
    test('should return true', () => {
        const date1 = new Date('2020-02-20')
        const date2 = new Date('2020-02-20')
        const date3 = moment(date2).add(1, 'hour').toDate()
        expect(sameDay(date1, date2)).toBe(true)
        expect(sameDay(date1, date3)).toBe(true)
    })
    test('should return false', () => {
        const date1 = new Date('2020-02-20')
        const date2 = new Date('2020-02-19')
        const date3 = new Date('2020-02-21')
        expect(sameDay(date1, date2)).toBe(false)
        expect(sameDay(date1, date3)).toBe(false)
        expect(sameDay(date2, date3)).toBe(false)
    })
})
