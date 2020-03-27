import { append, concat, pick, take } from 'ramda'
import { Dependencies } from '../container'
import { BadRequestError, UnauthorizedError } from '../error/HttpError'
import { renameKeys } from '../utils'
import {
    ReservationDetail,
    RoomSearchPayload,
    SelectedRoom
} from './reservation.interface'
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
    ): Promise<ReservationDetail>
    getReservationDetails(
        reservation_id: string,
        guest_id: string
    ): Promise<ReservationDetail>
    getReservationPaymentStatus(
        reservation_id: string,
        guest_id: string
    ): Promise<boolean>
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
        const reservation = await this.reservationRepository.makeReservation(
            check_in,
            check_out,
            guest_id,
            beds,
            specialRequests
        )
        return this.getReservationDetails(reservation.id, guest_id)
    }
    async getReservationDetails(reservation_id: string, guest_id: string) {
        const reservation = await this.reservationRepository.getReservation(
            reservation_id
        )
        if (!reservation) {
            throw new BadRequestError('Reservation not found.')
        }
        if (reservation.guest_id !== guest_id) {
            throw new UnauthorizedError(
                'Can not get reservation details that is not your own.'
            )
        }
        const details = pick(
            ['id', 'check_in', 'check_out', 'special_requests', 'rooms'],
            reservation
        )
        return renameKeys(
            {
                check_in: 'checkIn',
                check_out: 'checkOut',
                special_requests: 'specialRequests'
            },
            details
        ) as ReservationDetail
    }
    async getReservationPaymentStatus(
        reservation_id: string,
        guest_id: string
    ) {
        const reservation = await this.reservationRepository.getReservationTransaction(
            reservation_id
        )
        if (!reservation) {
            throw new BadRequestError('Reservation not found.')
        }
        console.log(reservation.guest_id)
        console.log(guest_id)
        if (reservation.guest_id !== guest_id) {
            throw new UnauthorizedError(
                'Can not get reservation payment status that is not your own.'
            )
        }
        return !!reservation.transaction
    }
}
