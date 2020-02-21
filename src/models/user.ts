import { Model } from 'objection'
import uuid from 'uuid/v4'
import BaseModel from './base'
import { Reservation } from './reservation'
export interface User {
    id: string
    username: string
    email: string
    password: string
    firstname: string
    lastname: string
    phone?: string
    address?: string
    reservationMade?: Reservation
    reservationIn?: Reservation[]
}
export default class UserModel extends BaseModel implements User {
    id!: string
    username!: string
    email!: string
    password!: string
    firstname!: string
    lastname!: string
    phone?: string
    address?: string
    static tableName = 'user'
    static relationMappings = {
        reservationMade: {
            relation: Model.HasManyRelation,
            modelClass: 'reservation',
            join: {
                from: 'user.id',
                to: 'reservation.user'
            }
        },
        reservationIn: {
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
    $beforeInsert() {
        this.id = uuid()
    }
}
