import { ReservationRepository } from '../reservation.repository'
import { ReservationService } from '../reservation.service'
import { SelectedRoom } from '../reservation.interface'

describe('make reservation', () => {
    const fakeRepository: Pick<
        ReservationRepository,
        | 'findAvailableBeds'
        | 'conflictingReservations'
        | 'listRoomMaintenance'
        | 'makeReservation'
        | 'getReservationWithRoom'
    > = {
        async findAvailableBeds() {
            return [
                {
                    id: 1,
                    beds: [{ id: 1 }, { id: 2 }]
                },
                {
                    id: 2,
                    beds: [{ id: 3 }, { id: 4 }]
                }
            ] as any[]
        },
        async conflictingReservations(_, check_in: Date, check_out: Date) {
            if (
                check_in >= new Date('2020-04-20') &&
                check_in <= new Date('2020-04-25')
            ) {
                return [{} as any]
            } else {
                return []
            }
        },
        async listRoomMaintenance(id: number, check_in: Date, check_out: Date) {
            if (
                check_in >= new Date('2020-04-27') &&
                check_in <= new Date('2020-04-30') &&
                id === 1
            ) {
                return [{} as any]
            } else {
                return []
            }
        },
        async makeReservation() {
            return { id: 1 } as any
        },
        async getReservationWithRoom() {
            return { guest_id: '1' } as any
        }
    }
    const r = new ReservationService({
        reservationRepository: fakeRepository as any
    })
    test('invalid room length', async () => {
        const check_in = new Date('2020-05-01')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = []
        expect.assertions(1)
        try {
            await r.makeReservation(check_in, check_out, guest_id, rooms)
        } catch (e) {
            expect(e.message).toBe('You must choose some rooms.')
        }
    })
    test('invalid guest number', async () => {
        const check_in = new Date('2020-05-01')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [{ id: 1, guests: -1 }]
        expect.assertions(1)
        try {
            await r.makeReservation(check_in, check_out, guest_id, rooms)
        } catch (e) {
            expect(e.message).toBe('Invalid number of guests.')
        }
    })
    test('invalid duplicate room', async () => {
        const check_in = new Date('2020-05-01')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [
            { id: 1, guests: 1 },
            { id: 1, guests: 1 }
        ]
        expect.assertions(1)
        try {
            await r.makeReservation(check_in, check_out, guest_id, rooms)
        } catch (e) {
            expect(e.message).toBe(
                'Invalid Reservation. Can not reserve one room multiple times.'
            )
        }
    })
    test('invalid check in check out date', () => {
        const check_in = new Date('2020-05-11')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [{ id: 1, guests: 1 }]
        expect.assertions(1)
        expect(
            r.makeReservation(check_in, check_out, guest_id, rooms)
        ).rejects.toThrow('Invalid check in and check out date.')
    })
    test('too many guests', async () => {
        const check_in = new Date('2020-05-01')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [{ id: 1, guests: 3 }]
        expect.assertions(1)
        try {
            await r.makeReservation(check_in, check_out, guest_id, rooms)
        } catch (e) {
            expect(e.message).toBe(
                'Invalid Reservation. Some rooms do not have enough beds.'
            )
        }
    })
    test('reservation conflicts', async () => {
        const check_in = new Date('2020-04-23')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [{ id: 1, guests: 2 }]
        expect.assertions(1)
        try {
            await r.makeReservation(check_in, check_out, guest_id, rooms)
        } catch (e) {
            expect(e.message).toBe(
                'Invalid Reservation. You already have reservations on this date.'
            )
        }
    })
    test('rooms have maintenance', async () => {
        const check_in = new Date('2020-04-28')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [{ id: 1, guests: 2 }]
        expect.assertions(1)
        try {
            await r.makeReservation(check_in, check_out, guest_id, rooms)
        } catch (e) {
            expect(e.message).toBe(
                'Invalid date. There are maintenance in this range of date.'
            )
        }
    })
    test('valid input', async () => {
        const check_in = new Date('2020-05-02')
        const check_out = new Date('2020-05-10')
        const guest_id = '1'
        const rooms: SelectedRoom[] = [{ id: 1, guests: 2 }]
        expect.assertions(1)
        try {
            expect(
                await r.makeReservation(check_in, check_out, guest_id, rooms)
            ).toBeDefined()
        } catch (e) {}
    })
})
