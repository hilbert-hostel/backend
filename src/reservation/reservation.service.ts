import {
    roomAssignmentByPrice,
    roomAssignmentByRoomOccupancy,
    checkAvailabilityOfHotel
} from 'hilbert-room-assignment'
import {
    append,
    concat,
    evolve,
    map,
    mergeLeft,
    mergeRight,
    omit,
    pick,
    pipe,
    take
} from 'ramda'
import { Dependencies } from '../container'
import {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError
} from '../error/HttpError'
import { Room } from '../models/room'
import { renameKeys } from '../utils'
import {
    ReservationDetail,
    RoomSearch,
    RoomSearchPayload,
    RoomSuggestion,
    SelectedRoom
} from './reservation.interface'
import { IReservationRepository } from './reservation.repository'
import {
    checkEnoughBeds,
    checkNoDuplicateRooms,
    validCheckInCheckOutDate
} from './reservation.utils'
import { Reservation } from '../models/reservation'
export interface IReservationService {
    searchAvailableRooms(
        check_in: Date,
        check_out: Date,
        guests: number
    ): Promise<RoomSearchPayload>
    makeReservation(
        check_in: Date,
        check_out: Date,
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
    listGuestReservations(guest_id: string): Promise<ReservationDetail[]>
    updateSpecialRequests(
        reservation_id: string,
        special_requests: string,
        guest_id: string
    ): Promise<Reservation>
}

export class ReservationService implements IReservationService {
    reservationRepository: IReservationRepository
    constructor({
        reservationRepository
    }: Dependencies<IReservationRepository>) {
        this.reservationRepository = reservationRepository
    }

    async searchAvailableRooms(
        check_in: Date,
        check_out: Date,
        guests: number
    ) {
        if (!validCheckInCheckOutDate(check_in, check_out)) {
            throw new BadRequestError('Invalid check in and check out date.')
        }
        if (guests < 1) {
            throw new BadRequestError('Invalid number of guests.')
        }
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
        }, {} as { [key: string]: Omit<RoomSearch, 'type'> })
        const result: RoomSearch[] = []
        for (const type in availability) {
            result.push({ ...availability[type], type })
        }
        const roomDetails: { [key: number]: Room } = rooms.reduce(
            (acc, cur) => {
                return mergeRight(acc, { [cur.id]: cur })
            },
            {}
        )
        const roomList = map(
            ({ id, price, beds }) => ({ id, price, available: beds!.length }),
            rooms
        )
        const enoughBeds = checkAvailabilityOfHotel({ roomList, guests })
        if (!enoughBeds) {
            throw new BadRequestError(`Not enough beds  for ${guests} guests`)
        }
        const fillInRoomDetail = evolve({
            roomConfig: map(
                (config: { id: number; price: number; guests: number }) =>
                    omit(
                        ['beds'],
                        mergeLeft(config, roomDetails[config.id])
                    ) as RoomSuggestion
            )
        })
        try {
            const lowestPrice = pipe(
                roomAssignmentByPrice,
                map(fillInRoomDetail)
            )({
                roomList,
                guests,
                query: 3
            })

            const lowestNumberOfRooms = pipe(
                roomAssignmentByRoomOccupancy,
                map(fillInRoomDetail)
            )({
                roomList,
                guests,
                query: 3
            })

            return {
                rooms: result,
                suggestions: { lowestPrice, lowestNumberOfRooms }
            }
        } catch (e) {
            throw new BadRequestError(e.message)
        }
    }

    async makeReservation(
        check_in: Date,
        check_out: Date,
        guest_id: string,
        rooms: SelectedRoom[],
        specialRequests: string = ''
    ) {
        if (rooms.length === 0) {
            throw new BadRequestError('You must choose some rooms.')
        }
        if (rooms.some(r => r.guests <= 0)) {
            throw new BadRequestError('Invalid number of guests.')
        }
        const noDuplicates = checkNoDuplicateRooms(rooms)
        if (!noDuplicates) {
            throw new BadRequestError(
                'Invalid Reservation. Can not reserve one room multiple times.'
            )
        }
        if (!validCheckInCheckOutDate(check_in, check_out)) {
            throw new BadRequestError('Invalid check in and check out date.')
        }
        const db_rooms = await this.reservationRepository.findAvailableBeds(
            check_in,
            check_out,
            rooms.map(r => r.id)
        )
        const enoughBeds = checkEnoughBeds(db_rooms, rooms)

        if (!enoughBeds) {
            throw new BadRequestError(
                'Invalid Reservation. Some rooms do not have enough beds.'
            )
        }

        const conflicts = await this.reservationRepository.conflictingReservations(
            guest_id,
            check_in,
            check_out
        )
        if (conflicts.length > 0) {
            throw new BadRequestError(
                'Invalid Reservation. You already have reservations on this date.'
            )
        }
        for (const room of rooms) {
            const existingMaitenance = await this.reservationRepository.listRoomMaintenance(
                room.id,
                check_in,
                check_out
            )
            const hasMaintenance = existingMaitenance.length > 0
            if (hasMaintenance) {
                throw new BadRequestError(
                    'Invalid date. There are maintenance in this range of date.'
                )
            }
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
        const reservation = await this.reservationRepository.getReservationWithRoom(
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

        return pipe(
            pick([
                'id',
                'check_in',
                'check_out',
                'special_requests',
                'rooms',
                'transaction'
            ]),
            evolve({
                rooms: map(evolve({ beds: i => i.length })),
                transaction: t => t?.paid ?? false
            }),
            renameKeys({
                check_in: 'checkIn',
                check_out: 'checkOut',
                special_requests: 'specialRequests',
                transaction: 'isPaid'
            })
        )(reservation) as ReservationDetail
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
        if (reservation.guest_id !== guest_id) {
            throw new UnauthorizedError(
                'Can not get reservation payment status that is not your own.'
            )
        }
        return !!reservation.transaction
    }
    async listGuestReservations(guest_id: string) {
        const reservation = await this.reservationRepository.listReservations(
            guest_id
        )

        return map(
            pipe(
                pick([
                    'id',
                    'check_in',
                    'check_out',
                    'special_requests',
                    'rooms',
                    'transaction'
                ]),
                evolve({
                    rooms: map(evolve({ beds: i => i.length })),
                    transaction: t => t?.paid
                }),
                renameKeys({
                    check_in: 'checkIn',
                    check_out: 'checkOut',
                    special_requests: 'specialRequests',
                    transaction: 'isPaid'
                })
            ),
            reservation
        ) as ReservationDetail[]
    }
    async updateSpecialRequests(
        reservation_id: string,
        special_requests: string,
        guest_id: string
    ) {
        const reservation = await this.reservationRepository.getReservation(
            reservation_id
        )
        if (reservation.guest_id !== guest_id) {
            throw new ForbiddenError(
                'Can not edit reservation that is not your own'
            )
        }
        return this.reservationRepository.updateSpecialRequests(
            reservation_id,
            special_requests
        )
    }
}
