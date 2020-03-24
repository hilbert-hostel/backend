import { Model } from 'objection'
import BaseModel from './base'
import { Bed } from './bed'
import { Facility } from './facility'
import { RoomPhoto } from './roomPhoto'

export interface RoomFacility extends Facility {
    count: number
}
export interface Room {
    id: number
    price: number
    type: string
    description?: string
    facilities: RoomFacility[]
    photos?: RoomPhoto[]
    beds?: Bed[]
}
export default class RoomModel extends BaseModel implements Room {
    id!: number
    price!: number
    type!: string
    description?: string
    facilities!: RoomFacility[]
    photos?: RoomPhoto[]
    beds?: Bed[]

    static tableName = 'room'
    static relationMappings = {
        photos: {
            relation: Model.HasManyRelation,
            modelClass: 'roomPhoto',
            join: {
                from: 'room.id',
                to: 'room_photo.room_id'
            }
        },
        facilities: {
            relation: Model.ManyToManyRelation,
            modelClass: 'facility',
            join: {
                from: 'room.id',
                through: {
                    from: 'room_facility_pair.room_id',
                    to: 'room_facility_pair.facility_id',
                    extra: ['count']
                },
                to: 'facility.id'
            }
        },
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
