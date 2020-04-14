import { Model } from 'objection'
import BaseModel from './base'
export interface Otp {
    id: string
    password: string
    reference_code: string
}
export default class OtpModel extends BaseModel implements Otp {
    id!: string
    password!: string
    reference_code!: string
    static tableName = 'otp'
    static relationMappings = {
        reservation: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'reservation',
            join: {
                from: 'otp.id',
                to: 'reservation.id'
            }
        }
    }
}
