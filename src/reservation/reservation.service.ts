import { Dependencies } from '../container'
import { RoomSearchPayload } from './reservation.interface'
import { IReservationRepository } from './reservation.repository'

export interface IReservationService {
    findAvailableRooms(
        check_in: string,
        check_out: string,
        guests: number
    ): Promise<RoomSearchPayload[]>
}

export class ReservationService implements IReservationService {
    reservationRepository: IReservationRepository
    constructor({
        reservationRepository
    }: Dependencies<IReservationRepository>) {
        this.reservationRepository = reservationRepository
    }

    async findAvailableRooms(
        check_in: string,
        check_out: string,
        guests: number
    ) {
        const rooms = await this.reservationRepository.findAvailableRooms(
            check_in,
            check_out
        )

        return rooms.map(({ beds, ...rest }) => ({
            ...rest,
            available: beds?.length ?? 0
        }))
    }
}
