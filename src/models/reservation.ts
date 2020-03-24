import { Model } from 'objection'
import shortid from 'shortid'
import BaseModel from './base'
import { Bed } from './bed'
import { CreatedUpdatedAt, GenID } from './decorators'
import { Guest } from './guest'
import { Record } from './record'
import { Transaction } from './transaction'
export interface Reservation {
    id: string
    check_in: Date
    check_out: Date
    special_requests?: string
    created_at: Date
    updated_at: Date
    beds?: Bed[]
    guest?: Guest
    check_in_enter_time?: Date
    check_out_exit_time?: Date
    otp?: string
    record?: Record
    transaction?: Transaction
}
@GenID(shortid)
@CreatedUpdatedAt()
export class ReservationModel extends BaseModel implements Reservation {
    id!: string
    check_in!: Date
    check_out!: Date
    special_requests?: string
    created_at!: Date
    updated_at!: Date
    check_in_enter_time?: Date
    check_out_exit_time?: Date
    otp?: string
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
        record: {
            relation: Model.HasOneRelation,
            modelClass: 'record',
            join: {
                from: 'reservation.id',
                to: 'record.reservation_id'
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
        }
    }
}
