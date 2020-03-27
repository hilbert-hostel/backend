import uuid from 'uuid/v4'
import BaseModel from './base'
import { GenID } from './decorators'

export interface Record {
    id: string
    photo: string
    id_card_data: any
}
@GenID(uuid)
export default class RecordModel extends BaseModel implements Record {
    id!: string
    photo!: string
    id_card_data!: any
    static tableName = 'record'
}
