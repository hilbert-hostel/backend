import { Model } from 'objection'
import shortid from 'shortid'
import BaseModel from './base'
import { Bed } from './bed'
import { User } from './user'
export interface Reservation {
    id: string
    check_in: Date
    check_out: Date
    add_ons?: string
    special_requests?: string
    created_at: Date
    updated_at: Date
    beds?: Bed[]
    user?: User
    members?: User[]
}
export class ReservationModel extends BaseModel implements Reservation {
    id!: string
    check_in!: Date
    check_out!: Date
    add_ons?: string
    special_requests?: string
    created_at!: Date
    updated_at!: Date
    static tableName = 'reservation'

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: 'user',
            join: {
                from: 'reservation.user_id',
                to: 'user.id'
            }
        },
        members: {
            relation: Model.ManyToManyRelation,
            modelClass: 'user',
            join: {
                from: 'reservation.id',
                through: {
                    from: 'reservation_member.reservation_id',
                    to: 'reservation_member.user_id'
                },
                to: 'user.id'
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
    $beforeInsert() {
        this.id = shortid.generate()
    }
}
