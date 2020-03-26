import BaseModel from './base'

export default class ReservedBedModel extends BaseModel {
    bed_id!: number
    reservation_id!: string
    static tableName = 'reserved_bed'
}
