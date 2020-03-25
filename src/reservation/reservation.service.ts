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
        const availability = rooms.reduce((acc, cur) => {
            const { type, beds, id, ...rest } = cur
            const available = beds!.length
            const old = acc[type] ?? { ...rest, availability: [] }
            return {
                ...acc,
                [type]: {
                    ...old,
                    availability: [...old.availability, { id, available }]
                }
            }
        }, {} as { [key: string]: Omit<RoomSearchPayload, 'type'> })
        const result: RoomSearchPayload[] = []
        for (const type in availability) {
            result.push({ ...availability[type], type })
        }
        return result
    }
}
