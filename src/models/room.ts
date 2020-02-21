import { Model } from 'objection'
import BaseModel from './base'
import { Bed } from './bed'

export interface Room {
    id: number
    price: number
    type: string
    description?: string
    facilities?: string[]
    beds?: Bed[]
}
export default class RoomModel extends BaseModel implements Room {
    id!: number
    price!: number
    type!: string
    description?: string
    facilities?: string[]

    static tableName = 'room'
    static relationMappings = {
        beds: {
            relation: Model.HasManyRelation,
            modelClass: 'bed',
            join: {
                from: 'room.id',
                to: 'bed.room_id'
            }
        }
    }
}
