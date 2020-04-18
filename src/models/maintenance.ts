import { Model } from 'objection'
import BaseModel from './base'
import { CreatedAt } from './decorators'
import { Room } from './room'
export interface Maintenance {
    id: number
    created_at: Date
    from: Date
    to: Date
    description?: string
    room_id: number
    room?: Room
}

@CreatedAt()
export default class MaintenanceModel extends BaseModel implements Maintenance {
    id!: number
    created_at!: Date
    from!: Date
    to!: Date
    description?: string
    room_id!: number
    room?: Room

    static tableName = 'maintenance'
    static relationMappings = {
        room: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'room',
            join: {
                from: 'maintenance.room_id',
                to: 'room.id'
            }
        }
    }
}
