import uuid from 'uuid/v4'
import BaseModel from './base'
import { GenID } from './decorators'
export interface VerificationToken {
    id: string
    user_id: string
    token: string
}
@GenID(uuid)
export default class VerificationTokenModel extends BaseModel
    implements VerificationToken {
    id!: string
    user_id!: string
    token!: string
    static tableName = 'verification_token'
}
