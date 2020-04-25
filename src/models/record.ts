import BaseModel from './base'

export interface Record {
    id: string
    photo: string
    id_card_data: any
}
export default class RecordModel extends BaseModel implements Record {
    id!: string
    photo!: string
    id_card_data!: any
    static tableName = 'record'
}
