import BaseModel from './base'

export interface RoomPhoto {
    id: number
    photo_url: string
    photo_description?: string
    room_id: number
}
export default class RoomPhotoModel extends BaseModel implements RoomPhoto {
    id!: number
    photo_url!: string
    photo_description?: string
    room_id!: number
    static tableName = 'room_photo'
}
