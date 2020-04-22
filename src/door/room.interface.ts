import { Room } from '../models/room'
import { Guest } from '../models/guest'

export interface RoomWithFollowers extends Room {
    followers: string[]
}

export interface RoomPayload {
    rooms: Room[]
    reservationID: string
}
