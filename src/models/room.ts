import { Model, QueryBuilder, ref } from 'objection'
import BaseModel from './base'
import { Bed } from './bed'
import { Facility } from './facility'
import MaintenanceModel, { Maintenance } from './maintenance'
import { RoomPhoto } from './roomPhoto'
import ReservationModel from './reservation'
import moment from 'moment'

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
    maintenance?: Maintenance[]
}
export default class RoomModel extends BaseModel implements Room {
    id!: number
    price!: number
    type!: string
    description?: string
    facilities!: RoomFacility[]
    photos?: RoomPhoto[]
    beds?: Bed[]
    maintenance?: Maintenance[]

    static tableName = 'room'
    static modifiers = {
        bedsAvailable(
            query: QueryBuilder<RoomModel, RoomModel[]>,
            check_in: Date,
            check_out: Date
        ) {
            query.withGraphJoined('beds').whereNotExists(
                ReservationModel.query()
                    .where(builder => {
                        builder
                            .whereBetween('check_in', [
                                check_in,
                                moment(check_out).subtract(1, 'day').toDate()
                            ])
                            .orWhereBetween('check_out', [
                                moment(check_in).add(1, 'day').toDate(),
                                check_out
                            ])
                    })
                    .join(
                        'reserved_bed as rb',
                        'reservation.id',
                        'rb.reservation_id'
                    )
                    .where('rb.bed_id', '=', ref('beds.id'))
            )
        },
        noMaintenance(
            query: QueryBuilder<RoomModel, RoomModel[]>,
            check_in: Date,
            check_out: Date
        ) {
            query.whereNotExists(
                MaintenanceModel.query()
                    .where('room_id', '=', ref('room.id'))
                    .where(builder => {
                        builder
                            .whereBetween('from', [
                                check_in,
                                moment(check_out).subtract(1, 'day').toDate()
                            ])
                            .orWhereBetween('to', [
                                moment(check_in).add(1, 'day').toDate(),
                                check_out
                            ])
                    })
            )
        }
    }

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
                    to: 'room_facility_pair.facility_name',
                    extra: ['count']
                },
                to: 'facility.name'
            }
        },
        beds: {
            relation: Model.HasManyRelation,
            modelClass: 'bed',
            join: {
                from: 'room.id',
                to: 'bed.room_id'
            }
        },
        maintenance: {
            relation: Model.HasManyRelation,
            modelClass: 'maintenance',
            join: {
                from: 'room.id',
                to: 'maintenance.room_id'
            }
        }
    }
}
