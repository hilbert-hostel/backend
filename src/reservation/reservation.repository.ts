import moment from 'moment'
import { ref } from 'objection'
import MaintenanceModel, { Maintenance } from '../models/maintenance'
import ReservationModel, { Reservation } from '../models/reservation'
import ReservedBedModel from '../models/reserved_bed'
import RoomModel, { Room } from '../models/room'
import { Transaction } from '../models/transaction'

export interface ReservationWithRoom extends Reservation {
    rooms: Room[]
    transaction: Transaction
}
export interface IReservationRepository {
    findAvailableRooms(check_in: Date, check_out: Date): Promise<Room[]>
    findAvailableBeds(
        check_in: Date,
        check_out: Date,
        room_id: number
    ): Promise<Room>
    listRoomMaintenance(
        room_id: number,
        from: Date,
        to: Date
    ): Promise<Maintenance[]>
    makeReservation(
        check_in: Date,
        check_out: Date,
        guest_id: string,
        beds: { id: number }[],
        special_requests: string
    ): Promise<Reservation>
    mapRoomsToReservations(
        reservations: Reservation[]
    ): Promise<ReservationWithRoom[]>
    findRoomsInReservation(reservation_id: string): Promise<Room[]>
    getReservation(reservation_id: string): Promise<ReservationWithRoom>
    getReservationTransaction(reservation_id: string): Promise<Reservation>
    listReservations(guest_id: string): Promise<ReservationWithRoom[]>
    conflictingReservations(
        guest_id: string,
        check_in: Date,
        check_out: Date
    ): Promise<Reservation[]>
}

export class ReservationRepository implements IReservationRepository {
    async findAvailableRooms(check_in: Date, check_out: Date) {
        const result = await RoomModel.query()
            .withGraphJoined('beds')
            .whereNotExists(
                ReservationModel.query()
                    .where(builder => {
                        builder
                            .whereBetween('check_in', [
                                check_in,
                                moment(check_out).subtract(1, 'day').toDate()
                            ])
                            .orWhereBetween('check_out', [
                                moment(check_in).add(1, 'day').toDate(),
                                check_out
                            ])
                    })
                    .join(
                        'reserved_bed as rb',
                        'reservation.id',
                        'rb.reservation_id'
                    )
                    .where('rb.bed_id', '=', ref('beds.id'))
            )
            .whereNotExists(
                MaintenanceModel.query()
                    .where('room_id', '=', ref('room.id'))
                    .where(builder => {
                        builder
                            .whereBetween('from', [
                                check_in,
                                moment(check_out).subtract(1, 'day').toDate()
                            ])
                            .orWhereBetween('to', [
                                moment(check_in).add(1, 'day').toDate(),
                                check_out
                            ])
                    })
            )
            .withGraphJoined('photos')
            .modifyGraph('photos', photo => {
                photo.select('photo_url', 'photo_description')
            })
            .withGraphJoined('facilities')
            .orderBy('room.id')
        return result
    }
    async findAvailableBeds(check_in: Date, check_out: Date, room_id: number) {
        const result = RoomModel.query()
            .findById(room_id)
            .withGraphJoined('beds')
            .whereNotExists(
                ReservationModel.query()
                    .where(builder => {
                        builder
                            .whereBetween('check_in', [
                                check_in,
                                moment(check_out).subtract(1, 'day').toDate()
                            ])
                            .orWhereBetween('check_out', [
                                moment(check_in).add(1, 'day').toDate(),
                                check_out
                            ])
                    })
                    .join(
                        'reserved_bed as rb',
                        'reservation.id',
                        'rb.reservation_id'
                    )
                    .where('rb.bed_id', '=', ref('beds.id'))
            )
            .whereNotExists(
                MaintenanceModel.query()
                    .where('room_id', '=', room_id)
                    .where(builder => {
                        builder
                            .whereBetween('from', [
                                check_in,
                                moment(check_out).subtract(1, 'day').toDate()
                            ])
                            .orWhereBetween('to', [
                                moment(check_in).add(1, 'day').toDate(),
                                check_out
                            ])
                    })
            )
        return result
    }
    listRoomMaintenance(room_id: number, from: Date, to: Date) {
        return MaintenanceModel.query()
            .where({ room_id })
            .where(builder => {
                builder
                    .whereBetween('from', [
                        from,
                        moment(to).subtract(1, 'day').toDate()
                    ])
                    .orWhereBetween('to', [
                        moment(from).add(1, 'day').toDate(),
                        to
                    ])
            })
    }
    async makeReservation(
        check_in: Date,
        check_out: Date,
        guest_id: string,
        beds: { id: number }[],
        special_requests: string
    ) {
        const reservation = await ReservationModel.query().insert({
            check_in: check_in,
            check_out: check_out,
            guest_id,
            special_requests
        })
        const reservedBeds = beds.map(({ id: bed_id }) => ({
            bed_id,
            reservation_id: reservation.id
        }))
        await ReservedBedModel.query().insert(reservedBeds)
        return reservation
    }
    findRoomsInReservation(reservation_id: string) {
        return RoomModel.query()
            .withGraphJoined('beds', {
                joinOperation: 'rightJoin'
            })
            .modifyGraph('beds', bed => {
                bed.innerJoinRelated('reservations').where(
                    'reservations.id',
                    '=',
                    reservation_id
                )
            })
            .withGraphJoined('photos')
            .modifyGraph('photos', photo => {
                photo.select('photo_url', 'photo_description')
            })
            .withGraphJoined('facilities')
            .orderBy('room.id')
    }
    mapRoomsToReservations(reservations: Reservation[]) {
        return Promise.all(
            reservations.map(async r => {
                const rooms = await this.findRoomsInReservation(r.id)
                return {
                    ...r,
                    rooms
                } as ReservationWithRoom
            })
        )
    }
    async getReservation(reservation_id: string) {
        const reservation = await ReservationModel.query()
            .findById(reservation_id)
            .withGraphJoined('transaction')
            .withGraphJoined('followers')
        const rooms = await this.findRoomsInReservation(reservation_id)
        return {
            ...reservation,
            rooms
        } as ReservationWithRoom
    }

    async getReservationTransaction(reservation_id: string) {
        const reservation = await ReservationModel.query()
            .findById(reservation_id)
            .withGraphJoined('transaction')
        return reservation
    }

    async listReservations(guest_id: string) {
        const reservations = await ReservationModel.query()
            .where({ guest_id })
            .withGraphJoined('transaction')
        return this.mapRoomsToReservations(reservations)
    }

    async conflictingReservations(
        guest_id: string,
        check_in: Date,
        check_out: Date
    ) {
        const reservations = await ReservationModel.query()
            .where({ guest_id })
            .where(builder => {
                builder
                    .whereBetween('check_in', [
                        check_in,
                        moment(check_out).subtract(1, 'day').toDate()
                    ])
                    .orWhereBetween('check_out', [
                        moment(check_in).add(1, 'day').toDate(),
                        check_out
                    ])
            })
            .withGraphJoined('beds')
        return reservations
    }
}
