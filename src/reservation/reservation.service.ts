import { append, concat, take } from 'ramda'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { Reservation } from '../models/reservation'
import { RoomSearchPayload, SelectedRoom } from './reservation.interface'
import { IReservationRepository } from './reservation.repository'
import { checkEnoughBeds, checkNoDuplicateRooms } from './reservation.utils'
export interface IReservationService {
    findAvailableRooms(
        check_in: string,
        check_out: string,
        guests: number
    ): Promise<RoomSearchPayload[]>
    makeReservation(
        check_in: string,
        check_out: string,
        guest_id: string,
        rooms: SelectedRoom[],
        specialRequests: string
    ): Promise<Reservation>
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
                    availability: append({ id, available }, old.availability)
                }
            }
        }, {} as { [key: string]: Omit<RoomSearchPayload, 'type'> })
        const result: RoomSearchPayload[] = []
        for (const type in availability) {
            result.push({ ...availability[type], type })
        }
        return result
    }

    async makeReservation(
        check_in: string,
        check_out: string,
        guest_id: string,
        rooms: SelectedRoom[],
        specialRequests: string = ''
    ) {
        const noDuplicates = checkNoDuplicateRooms(rooms)
        if (!noDuplicates) {
            throw new BadRequestError(
                'Invalid Reservation. Can not reserve one room multiple times.'
            )
        }
        const db_rooms = await Promise.all(
            rooms.map(r =>
                this.reservationRepository.findAvailableBeds(
                    check_in,
                    check_out,
                    r.id
                )
            )
        )
        const roomsValidity = checkEnoughBeds(db_rooms, rooms)

        if (!roomsValidity) {
            throw new BadRequestError(
                'Invalid Reservation. Some rooms do not have enough beds.'
            )
        }
        const roomsMap: {
            [key: number]: { id: number }[]
        } = db_rooms.reduce((acc, cur) => {
            return {
                ...acc,
                [cur.id]: cur.beds
            }
        }, {})
        const beds = rooms.reduce<{ id: number }[]>(
            (acc, cur) => concat(acc, take(cur.guests, roomsMap[cur.id])),
            []
        )
        return this.reservationRepository.makeReservation(
            check_in,
            check_out,
            guest_id,
            beds,
            specialRequests
        )
    }
}
