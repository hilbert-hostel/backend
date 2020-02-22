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
            .join('bed', 'room.id', '=', 'bed.room_id')
            .fullOuterJoin('reserved_bed', 'reserved_bed.bed_id', '=', 'bed.id')
            .fullOuterJoin(
                'reservation',
                'reservation.id',
                '=',
                'reserved_bed.reservation_id'
            )
            .whereNull('reservation.id')
            .orWhere('reservation.check_out', '<=', check_in)
            .orWhere('reservation.check_in', '>', check_out)
            .groupBy('room.id')
            .select('room.*', RoomModel.raw('array_agg(bed.id) as beds'))
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
