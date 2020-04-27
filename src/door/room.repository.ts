import GuestReservationRoomModel, {
    GuestReservationRoom
} from '../models/guest_reservation_room'
import ReservationModel, { Reservation } from '../models/reservation'
import RoomModel, { Room } from '../models/room'
import BedModel from '../models/bed'
import { ref } from 'objection'

export interface IRoomRepository {
    createGuestRoomReservation(
        guest_email: string,
        reservation_id: string,
        room_id: number
    ): Promise<GuestReservationRoom>
    findReservationById(reservation_id: string): Promise<Reservation>
    findRoomsInReservation(reservation_id: string): Promise<Room[]>
    findReservationIn(
        guest_id: string,
        guest_email: string,
        date: Date
    ): Promise<Reservation | undefined>
    findReservationWithOwner(reservation_id: string): Promise<Reservation>
    findGuestRoomReservation(
        guest_email: string,
        reservation_id: string
    ): Promise<GuestReservationRoom | undefined>
}

export class RoomRepository implements IRoomRepository {
    createGuestRoomReservation(
        guest_email: string,
        reservation_id: string,
        room_id: number
    ) {
        return GuestReservationRoomModel.query().insert({
            guest_email,
            reservation_id,
            room_id
        })
    }
    findReservationById(reservation_id: string) {
        return ReservationModel.query().findById(reservation_id)
    }
    findRoomsInReservation(reservation_id: string) {
        return RoomModel.query().whereExists(
            BedModel.query()
                .joinRelated('reservations')
                .where('reservations.id', '=', reservation_id)
                .where('room_id', '=', ref('room.id'))
        )
    }
    findGuestRoomReservation(guest_email: string, reservation_id: string) {
        return GuestReservationRoomModel.query()
            .findOne({
                guest_email,
                reservation_id
            })
            .withGraphJoined('room')
    }
    findReservationWithOwner(guest_id: string) {
        return ReservationModel.query()
            .findById(guest_id)
            .withGraphJoined('guest')
    }
    async findReservationIn(guest_id: string, guest_email: string, date: Date) {
        const reservationMade = await ReservationModel.query()
            .where({ guest_id })
            .where('check_in', '<=', date)
            .where('check_out', '>=', date)
            .whereNotNull('check_in_enter_time')
            .whereNull('check_out_exit_time')
        if (reservationMade[0]) {
            return reservationMade[0]
        }
        const reservationFollower = await GuestReservationRoomModel.query()
            .where({ guest_email })
            .withGraphJoined('reservation')
            .modifyGraph('reservation', reservation => {
                reservation
                    .where('check_in', '<=', date)
                    .where('check_out', '>=', date)
                    .whereNotNull('check_in_enter_time')
                    .whereNull('check_out_exit_time')
            })
        if (reservationFollower[0]) return reservationFollower[0].reservation
    }
}
