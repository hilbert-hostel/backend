import { Model } from 'objection'
import shortid from 'shortid'
import BaseModel from './base'
import { Bed } from './bed'
import { CreatedUpdatedAt, GenID } from './decorators'
import { Guest } from './guest'
import { Otp } from './otp'
import { Record } from './record'
import { Transaction } from './transaction'
import { GuestReservationRoom } from './guest_reservation_room'
export interface Reservation {
    id: string
    check_in: Date
    check_out: Date
    special_requests?: string
    created_at: Date
    updated_at: Date
    beds?: Bed[]
    guest?: Guest
    followers?: GuestReservationRoom[]
    guest_id: string
    check_in_enter_time?: Date
    check_out_exit_time?: Date
    otp?: Otp
    record?: Record
    transaction?: Transaction
}
export interface ReservationWithGuest extends Reservation {
    guest: Guest
}
@GenID(shortid)
@CreatedUpdatedAt()
export default class ReservationModel extends BaseModel implements Reservation {
    id!: string
    check_in!: Date
    check_out!: Date
    special_requests?: string
    created_at!: Date
    updated_at!: Date
    beds?: Bed[]
    guest?: Guest
    followers?: GuestReservationRoom[]
    guest_id!: string
    check_in_enter_time?: Date
    check_out_exit_time?: Date
    otp?: Otp
    record?: Record
    transaction?: Transaction

    static tableName = 'reservation'

    static relationMappings = {
        guest: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'guest',
            join: {
                from: 'reservation.guest_id',
                to: 'guest.id'
            }
        },
        followers: {
            relation: Model.HasManyRelation,
            modelClass: 'guest_reservation_room',
            join: {
                from: 'reservation.id',
                to: 'guest_reservation_room.reservation_id'
            }
        },
        record: {
            relation: Model.HasOneRelation,
            modelClass: 'record',
            join: {
                from: 'reservation.id',
                to: 'record.id'
            }
        },
        transaction: {
            relation: Model.HasOneRelation,
            modelClass: 'transaction',
            join: {
                from: 'reservation.id',
                to: 'transaction.reservation_id'
            }
        },
        beds: {
            relation: Model.ManyToManyRelation,
            modelClass: 'bed',
            join: {
                from: 'reservation.id',
                through: {
                    from: 'reserved_bed.reservation_id',
                    to: 'reserved_bed.bed_id'
                },
                to: 'bed.id'
            }
        },
        otp: {
            relation: Model.HasOneRelation,
            modelClass: 'otp',
            join: {
                from: 'reservation.id',
                to: 'otp.id'
            }
        }
    }
}
