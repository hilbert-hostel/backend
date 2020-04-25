import { ReservationInfoDatabase } from './admin.interface'
import { generateSummary, calculateStartEnd } from './summary'
describe('start end', () => {
    const check_in = new Date('2020-04-10')
    const check_out = new Date('2020-04-15')
    const r = {
        check_in,
        check_out
    } as any
    test('between', () => {
        const from = new Date('2020-04-07')
        const to = new Date('2020-04-16')
        const { start, end } = calculateStartEnd(r, from, to)
        expect(start).toEqual(check_in)
        expect(end).toEqual(check_out)
    })
    test('outside', () => {
        const from = new Date('2020-04-11')
        const to = new Date('2020-04-14')
        const { start, end } = calculateStartEnd(r, from, to)
        expect(start).toEqual(from)
        expect(end).toEqual(to)
    })
    test('before', () => {
        const from = new Date('2020-04-11')
        const to = new Date('2020-04-16')
        const { start, end } = calculateStartEnd(r, from, to)
        expect(start).toEqual(from)
        expect(end).toEqual(check_out)
    })
    test('after', () => {
        const from = new Date('2020-04-07')
        const to = new Date('2020-04-13')
        const { start, end } = calculateStartEnd(r, from, to)
        expect(start).toEqual(check_in)
        expect(end).toEqual(to)
    })
})

test('summary', () => {
    const reservations: any[] = [
        {
            check_in: new Date('2020-04-10'),
            check_out: new Date('2020-04-15'),
            rooms: [
                {
                    beds: [1, 2, 3, 4]
                },
                {
                    beds: [5, 6, 7, 8]
                }
            ],
            transaction: {
                amount: 2000
            }
        },
        {
            check_in: new Date('2020-04-12'),
            check_out: new Date('2020-04-18'),
            rooms: [
                {
                    beds: [15, 16, 17, 18]
                }
            ],
            transaction: {
                amount: 1000
            }
        }
    ]
    const from = new Date('2020-04-07')
    const to = new Date('2020-04-16')
    const totalBeds = 20
    const summary = generateSummary(reservations, from, to, totalBeds)
    expect(summary.guests).toEqual(12)
    // expect(summary.utilization).toEqual()
})
