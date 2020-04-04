import ReservationModel, { Reservation } from '../models/reservation'

export interface ICheckOutRepository {
    addCheckOutTime(reservation_id: string, time: Date): Promise<Reservation>
}
export class CheckOutRepository {
    addCheckOutTime(reservation_id: string, time: Date) {
        return ReservationModel.query()
            .patch({ check_out_exit_time: time })
            .findById(reservation_id)
    }
}
