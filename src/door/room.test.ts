import { IRoomRepository } from './room.repository'
import { RoomService } from './room.service'

describe('room sharing', () => {
    const roomRepository: Partial<IRoomRepository> = {
        async findReservationById(id: string) {
            if (id === '1') {
                return {
                    guest_id: '1'
                } as any
            } else {
                return {
                    guest_id: '2'
                } as any
            }
        },
        async findRoomsInReservation(id: string) {
            if (id === '1') {
                return [{ id: 1 }, { id: 2 }] as any
            } else {
                return [{ id: 3 }, { id: 4 }] as any
            }
        },
        async findGuestRoomReservation(email: string, reservation: string) {
            if (email === 'jay' && reservation === '1') {
                return {
                    guest_email: 'jay',
                    reservation_id: '1',
                    room_id: 1
                }
            }
        },
        async createGuestRoomReservation() {
            return {} as any
        }
    }
    const roomService = new RoomService({ roomRepository } as any)
    roomService.notifyShareRoom = async () => {}
    test('not owner', async () => {
        const ownerID: string = '2'
        const email: string = 'ice'
        const reservationID: string = '1'
        const roomID: number = 1
        expect.assertions(1)
        try {
            await roomService.shareRoom(ownerID, email, reservationID, roomID)
        } catch (e) {
            expect(e.message).toEqual(
                'Can not share room. You did not make this reservation.'
            )
        }
    })
    test('room not in reservation', async () => {
        const ownerID: string = '1'
        const email: string = 'ice'
        const reservationID: string = '1'
        const roomID: number = 3
        expect.assertions(1)
        try {
            await roomService.shareRoom(ownerID, email, reservationID, roomID)
        } catch (e) {
            expect(e.message).toEqual('This room is not in this reservation')
        }
    })
    test('already shared', async () => {
        const ownerID: string = '1'
        const email: string = 'jay'
        const reservationID: string = '1'
        const roomID: number = 2
        expect.assertions(1)
        try {
            await roomService.shareRoom(ownerID, email, reservationID, roomID)
        } catch (e) {
            expect(e.message).toEqual(
                'This email already has access to a room.'
            )
        }
    })
    test('already shared 2', async () => {
        const ownerID: string = '1'
        const email: string = 'jay'
        const reservationID: string = '1'
        const roomID: number = 1
        expect.assertions(1)
        try {
            await roomService.shareRoom(ownerID, email, reservationID, roomID)
        } catch (e) {
            expect(e.message).toEqual(
                'You already shared this room to this email.'
            )
        }
    })
    test('valid', async () => {
        const ownerID: string = '1'
        const email: string = 'ice'
        const reservationID: string = '1'
        const roomID: number = 1
        expect.assertions(1)
        try {
            expect(
                await roomService.shareRoom(
                    ownerID,
                    email,
                    reservationID,
                    roomID
                )
            ).toBeDefined()
        } catch (e) {}
    })
})
