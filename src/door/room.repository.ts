import GuestReservationRoomModel, {
    GuestReservationRoom
} from '../models/guest_reservation_room'
import ReservationModel, { Reservation } from '../models/reservation'

export interface IRoomRepository {
    createGuestRoomReservation(
        guest_email: string,
        reservation_id: string,
        room_id: number
    ): Promise<GuestReservationRoom>
    findReservationById(reservation_id: string): Promise<Reservation>
    findReservationIn(
        guest_id: string,
        guest_email: string,
        date: Date
    ): Promise<Reservation | undefined>
    findGuestRoomReservation(
        guest_email: string,
        reservation_id: string
    ): Promise<GuestReservationRoom>
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
    findGuestRoomReservation(guest_email: string, reservation_id: string) {
        return GuestReservationRoomModel.query()
            .findOne({
                guest_email,
                reservation_id
            })
            .withGraphJoined('room')
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
