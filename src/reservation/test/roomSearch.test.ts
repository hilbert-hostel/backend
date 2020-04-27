import { IReservationRepository } from '../reservation.repository'
import { ReservationService } from '../reservation.service'
import moment from 'moment'
import { RoomSearchPayload } from '../reservation.interface'

describe('search for rooms', () => {
    const fakeReservationRepository: Pick<
        IReservationRepository,
        'findAvailableRooms'
    > = {
        async findAvailableRooms(check_in: Date, check_out: Date) {
            if (
                moment(check_in).isSame('2020-04-01', 'day') &&
                moment(check_out).isSame('2020-04-05', 'day')
            ) {
                return [
                    {
                        id: 1,
                        price: 500,
                        type: 'A',
                        beds: [
                            { id: 1, room_id: 1 },
                            { id: 2, room_id: 1 },
                            { id: 3, room_id: 1 }
                        ],
                        facilities: []
                    },
                    {
                        id: 2,
                        price: 500,
                        type: 'A',
                        beds: [
                            { id: 4, room_id: 2 },
                            { id: 5, room_id: 2 },
                            { id: 6, room_id: 2 }
                        ],
                        facilities: []
                    }
                ]
            } else if (
                moment(check_in).isSame('2020-04-06', 'day') &&
                moment(check_out).isSame('2020-04-10', 'day')
            ) {
                return [
                    {
                        id: 1,
                        price: 500,
                        type: 'A',
                        beds: [
                            { id: 1, room_id: 1 },
                            { id: 2, room_id: 1 },
                            { id: 3, room_id: 1 }
                        ],
                        facilities: []
                    }
                ]
            } else {
                return []
            }
        }
    }
    const reservationService = new ReservationService({
        reservationRepository: fakeReservationRepository as any
    })
    describe('should fail', () => {
        test('invalid date', async () => {
            const checkIn = new Date('2020-04-05')
            const checkOut = new Date('2020-04-01')
            const guests = 5
            expect.assertions(1)
            expect(
                reservationService.searchAvailableRooms(
                    checkIn,
                    checkOut,
                    guests
                )
            ).rejects.toThrow('Invalid check in and check out date.')
        })
        test('invalid number of guests', async () => {
            const checkIn = new Date('2020-04-05')
            const checkOut = new Date('2020-04-11')
            expect.assertions(2)
            const g1 = -1
            const g2 = 0
            expect(
                reservationService.searchAvailableRooms(checkIn, checkOut, g1)
            ).rejects.toThrow('Invalid number of guests.')
            expect(
                reservationService.searchAvailableRooms(checkIn, checkOut, g2)
            ).rejects.toThrow('Invalid number of guests.')
        })
        test('invalid everything', async () => {
            const checkIn = new Date('2020-04-05')
            const checkOut = new Date('2020-04-01')
            const guests = -1
            expect.assertions(1)
            expect(
                reservationService.searchAvailableRooms(
                    checkIn,
                    checkOut,
                    guests
                )
            ).rejects.toThrowError()
        })
        test('too many guest', async () => {
            const checkIn = new Date('2020-04-01')
            const checkOut = new Date('2020-04-05')
            const g1 = 7
            const g2 = 10
            expect.assertions(2)
            expect(
                reservationService.searchAvailableRooms(checkIn, checkOut, g1)
            ).rejects.toThrow(`Not enough beds  for ${g1} guests`)
            expect(
                reservationService.searchAvailableRooms(checkIn, checkOut, g2)
            ).rejects.toThrow(`Not enough beds  for ${g2} guests`)
        })
    })
    test('should pass', async () => {
        const checkIn = new Date('2020-04-01')
        const checkOut = new Date('2020-04-05')
        const guests = 5
        expect.assertions(2)
        const results = await reservationService.searchAvailableRooms(
            checkIn,
            checkOut,
            guests
        )
        expect(results).toBeDefined()
        const expected: RoomSearchPayload = {
            rooms: [
                {
                    type: 'A',
                    availability: [
                        { id: 1, available: 3 },
                        { id: 2, available: 3 }
                    ],
                    price: 500,
                    facilities: []
                }
            ],
            suggestions: {
                lowestPrice: expect.any(Array),
                lowestNumberOfRooms: expect.any(Array)
            }
        }

        expect(results).toEqual(expected)
    })
})
