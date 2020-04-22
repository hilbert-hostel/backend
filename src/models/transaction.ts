import { Model } from 'objection'
import BaseModel from './base'
import { CreatedAt } from './decorators'
import { Reservation } from './reservation'

export interface Transaction {
    id: string
    created_at: Date
    method: string
    amount: number
    paid: boolean
    reservation_id: string
    reservation?: Reservation
}
@CreatedAt()
export default class TransactionModel extends BaseModel implements Transaction {
    id!: string
    created_at!: Date
    method!: string
    amount!: number
    paid!: boolean
    reservation_id!: string
    reservation?: Reservation
    static tableName = 'transaction'
    static relationMappings = {
        reservation: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'reservation',
            join: {
                from: 'transaction.reservation_id',
                to: 'reservation.id'
            }
        }
    }
}
