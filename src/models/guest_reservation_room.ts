import { Model } from 'objection'
import BaseModel from './base'
import { Reservation } from './reservation'
import { Room } from './room'

export interface GuestReservationRoom {
    guest_email: string
    reservation_id: string
    room_id: number
    reservation?: Reservation
    room?: Room
}
export default class GuestReservationRoomModel extends BaseModel
    implements GuestReservationRoom {
    guest_email!: string
    reservation_id!: string
    room_id!: number
    reservation?: Reservation
    room?: Room

    static tableName = 'guest_reservation_room'
    static idColumn = ['guest_email', 'reservation_id', 'room_id']
    static relationMappings = {
        guest: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'guest',
            join: {
                from: 'guest_reservation_room.guest_email',
                to: 'guest.email'
            }
        },
        reservation: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'reservation',
            join: {
                from: 'guest_reservation_room.reservation_id',
                to: 'reservation.id'
            }
        },
        room: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'room',
            join: {
                from: 'guest_reservation_room.room_id',
                to: 'room.id'
            }
        }
    }
}
