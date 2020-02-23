import { Reservation } from '../models/reservation'
import RoomModel, { Room } from '../models/room'

interface ReserveRoom {
    room_id: number
    guests: number
}

export interface IReservationRepository {
    findAvailableRooms(check_in: string, check_out: string): Promise<Room[]>
    makeReservation(
        check_in: string,
        check_out: string,
        rooms: ReserveRoom[]
    ): Promise<Reservation>
}

export class ReservationRepository implements IReservationRepository {
    findAvailableRooms(check_in: string, check_out: string) {
        return RoomModel.query()
            .withGraphJoined('beds', { joinOperation: 'innerJoin' })
            .modifyGraph('beds', bed => {
                bed.fullOuterJoinRelated('reservations')
                    .whereNull('reservations.id')
                    .orWhere('reservations.check_out', '<=', check_in)
                    .orWhere('reservations.check_in', '>', check_out)
                    .select('bed.id')
            })
            .orderBy('room.id')
    }

    async makeReservation(
        check_in: string,
        check_out: string,
        rooms: ReserveRoom[]
    ) {
        throw new Error('not implemented')
        return '' as any
    }
}
