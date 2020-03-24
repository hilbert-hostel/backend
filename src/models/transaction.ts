import BaseModel from './base'
import { CreatedAt } from './decorators'

export interface Transaction {
    id: string
    created_at: Date
    method: string
    amount: number
    reservation_id: string
}
@CreatedAt()
export default class TransactionModel extends BaseModel implements Transaction {
    id!: string
    created_at!: Date
    method!: string
    amount!: number
    reservation_id!: string
    static tableName = 'transaction'
}
