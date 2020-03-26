import { Reservation, ReservationModel } from '../models/reservation'
import ReservedBedModel from '../models/reserved_bed'
import RoomModel, { Room } from '../models/room'

export interface IReservationRepository {
    findAvailableRooms(check_in: string, check_out: string): Promise<Room[]>
    findAvailableBeds(
        check_in: string,
        check_out: string,
        room_id: number
    ): Promise<Room>
    makeReservation(
        check_in: string,
        check_out: string,
        guest_id: string,
        beds: { id: number }[],
        special_requests: string
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
            .withGraphJoined('photos')
            .modifyGraph('photos', photo => {
                photo.select('photo_url', 'photo_description')
            })
            .withGraphJoined('facilities')
            .orderBy('room.id')
    }
    async findAvailableBeds(
        check_in: string,
        check_out: string,
        room_id: number
    ) {
        return RoomModel.query()
            .findById(room_id)
            .withGraphJoined('beds')
            .modifyGraph('beds', bed => {
                bed.fullOuterJoinRelated('reservations')
                    .whereNull('reservations.id')
                    .orWhere('reservations.check_out', '<=', check_in)
                    .orWhere('reservations.check_in', '>', check_out)
                    .select('bed.id')
            })
    }
    async makeReservation(
        check_in: string,
        check_out: string,
        guest_id: string,
        beds: { id: number }[],
        special_requests: string
    ) {
        const reservation = await ReservationModel.query().insert({
            check_in: new Date(check_in),
            check_out: new Date(check_out),
            guest_id,
            special_requests
        })
        const reservedBeds = beds.map(({ id: bed_id }) => ({
            bed_id,
            reservation_id: reservation.id
        }))
        await ReservedBedModel.query()
            .insert(reservedBeds)
            .returning('bed_id')
        return reservation
    }
}
