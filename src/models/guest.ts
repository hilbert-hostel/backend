import { Model } from 'objection'
import uuid from 'uuid/v4'
import BaseModel from './base'
import { GenID } from './decorators'
import { Reservation } from './reservation'

export interface Guest {
    id: string
    email: string
    password: string
    firstname: string
    lastname: string
    national_id: string
    phone: string
    address: string
    reservation_made?: Reservation[]
    reservation_in?: Reservation[]
    is_verified: boolean
}
@GenID(uuid)
export default class GuestModel extends BaseModel implements Guest {
    id!: string
    email!: string
    password!: string
    firstname!: string
    lastname!: string
    national_id!: string
    phone!: string
    address!: string
    is_verified!: boolean
    static tableName = 'guest'
    static relationMappings = {
        reservation_made: {
            relation: Model.HasManyRelation,
            modelClass: 'reservation',
            join: {
                from: 'user.id',
                to: 'reservation.user'
            }
        },
        reservation_in: {
            relation: Model.ManyToManyRelation,
            modelClass: 'reservation',
            join: {
                from: 'user.id',
                through: {
                    from: 'reservation_member.user_id',
                    to: 'reservation_member.reservation_id'
                },
                to: 'reservation.id'
            }
        }
    }
}
