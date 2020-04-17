import ReservationModel, { Reservation } from '../models/reservation'

export interface ICheckOutRepository {
    addCheckOutTime(reservation_id: string, time: Date): Promise<Reservation>
    findReservationById(id: string): Promise<Reservation>
}
export class CheckOutRepository {
    addCheckOutTime(reservation_id: string, time: Date) {
        return ReservationModel.query().patchAndFetchById(reservation_id, {
            check_out_exit_time: time
        })
    }
    findReservationById(id: string): Promise<Reservation> {
        return ReservationModel.query().findById(id)
    }
}
