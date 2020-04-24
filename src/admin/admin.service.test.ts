import { stayDuration } from './admin.service'
test('stay duration', () => {
    const checkIn = new Date('2020-05-01')
    const checkOut = new Date('2020-05-10')
    expect(stayDuration(checkIn, checkOut)).toBe(9)
})
