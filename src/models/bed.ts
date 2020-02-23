import { Model } from 'objection'
import BaseModel from './base'
import { Room } from './room'
export interface Bed {
    id: number
    room_id: number
    room?: Room
}
export default class BedModel extends BaseModel implements Bed {
    id!: number
    room_id!: number
    static tableName = 'bed'
    static relationMappings = {
        room: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'room',
            join: {
                from: 'bed.room_id',
                to: 'room.id'
            }
        },
        reservations: {
            relation: Model.ManyToManyRelation,
            modelClass: 'reservation',
            join: {
                from: 'bed.id',
                through: {
                    from: 'reserved_bed.bed_id',
                    to: 'reserved_bed.reservation_id'
                },
                to: 'reservation.id'
            }
        }
    }
}
