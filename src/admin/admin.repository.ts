import { Dependencies } from '../container'
import GuestModel, { Guest } from '../models/guest'
import MaintenanceModel, { Maintenance } from '../models/maintenance'
import ReservationModel, {
    ReservationWithGuest,
    Reservation
} from '../models/reservation'
import RoomModel, { Room } from '../models/room'
import StaffModel, { Staff } from '../models/staff'
import { IReservationRepository } from '../reservation/reservation.repository'
import { CreateStaff, ReservationInfoDatabase } from './admin.interface'
import moment from 'moment'

export interface IAdminRespository {
    listReservations(from: Date, to: Date): Promise<ReservationInfoDatabase[]>
    listRoomReservations(
        room_id: number,
        from: Date,
        to: Date
    ): Promise<Reservation[]>
    findRoomsInReservation(reservation_id: string): Promise<Room[]>
    createStaff(input: CreateStaff): Promise<Staff>
    findStaff(input: Partial<Staff>): Promise<Staff>
    listGuests(page: number, size: number): Promise<Guest[]>
    listCheckIns(page: number, size: number): Promise<ReservationWithGuest[]>
    listCheckOuts(page: number, size: number): Promise<ReservationWithGuest[]>
    getAllRooms(): Promise<Room[]>
    findStaffById(id: string): Promise<Staff>
    listRoomMaintenance(
        room_id: number,
        from: Date,
        to: Date
    ): Promise<Maintenance[]>
    createMaintenance(
        room_id: number,
        from: Date,
        to: Date,
        description?: string
    ): Promise<Maintenance>
    listMaintenance(from: Date, to: Date): Promise<Maintenance[]>
    deleteMainenance(maintenance_id: number): Promise<Maintenance>
}

export class AdminRepository implements IAdminRespository {
    reservationRepository: IReservationRepository
    constructor({
        reservationRepository
    }: Dependencies<IReservationRepository>) {
        this.reservationRepository = reservationRepository
    }
    findRoomsInReservation(reservation_id: string) {
        return RoomModel.query()
            .withGraphJoined('beds', {
                joinOperation: 'rightJoin'
            })
            .modifyGraph('beds', bed => {
                bed.innerJoinRelated('reservations')
                    .where('reservations.id', '=', reservation_id)
                    .select('bed.id')
            })
            .orderBy('room.id')
    }
    async listReservations(from: Date, to: Date) {
        const reservations = await ReservationModel.query()
            .whereBetween('check_in', [from, to])
            .orWhereBetween('check_out', [from, to])
            .withGraphJoined('guest')
        return (await this.reservationRepository.mapRoomsToReservations(
            reservations
        )) as ReservationInfoDatabase[]
    }
    listRoomReservations(room_id: number, from: Date, to: Date) {
        return ReservationModel.query()
            .where(builder => {
                builder
                    .whereBetween('check_in', [
                        from,
                        moment(to).subtract(1, 'day').toDate()
                    ])
                    .orWhereBetween('check_out', [
                        moment(from).add(1, 'day').toDate(),
                        to
                    ])
            })
            .innerJoinRelated('beds.room')
            .where('beds:room.id', '=', room_id)
            .distinct('reservation.id')
            .select('reservation.*')
    }
    createStaff(input: CreateStaff) {
        return StaffModel.query().insert(input)
    }
    findStaff(input: Partial<Staff>) {
        return StaffModel.query().findOne(input)
    }
    async listGuests(page: number, size: number) {
        const result = await GuestModel.query().page(page, size)
        return result.results
    }
    async listCheckIns(page: number, size: number) {
        const reservations = await ReservationModel.query()
            .whereNotNull('check_in_enter_time')
            .withGraphJoined('guest')
            .withGraphJoined('beds')
            .withGraphJoined('record')
            .page(page, size)
            .orderBy('check_in_enter_time', 'DESC')
        return reservations.results as any
    }
    async listCheckOuts(page: number, size: number) {
        const reservations = await ReservationModel.query()
            .whereNotNull('check_out_exit_time')
            .withGraphJoined('guest')
            .page(page, size)
            .orderBy('check_out_exit_time', 'DESC')
        return reservations.results as any
    }
    getAllRooms() {
        return RoomModel.query()
            .withGraphJoined('beds')
            .modifyGraph('beds', bed => bed.select('bed.id'))
    }
    findStaffById(id: string) {
        return StaffModel.query().findById(id)
    }
    listRoomMaintenance(room_id: number, from: Date, to: Date) {
        return MaintenanceModel.query()
            .where({ room_id })
            .where(builder => {
                builder
                    .whereBetween('from', [
                        from,
                        moment(to).subtract(1, 'day').toDate()
                    ])
                    .orWhereBetween('to', [
                        moment(from).add(1, 'day').toDate(),
                        to
                    ])
            })
    }
    createMaintenance(
        room_id: number,
        from: Date,
        to: Date,
        description?: string
    ) {
        return MaintenanceModel.query().insert({
            room_id,
            from,
            to,
            description
        })
    }
    listMaintenance(from: Date, to: Date) {
        return MaintenanceModel.query()
            .whereBetween('from', [from, to])
            .orWhereBetween('to', [from, to])
    }
    deleteMainenance(maintenance_id: number) {
        return MaintenanceModel.query()
            .deleteById(maintenance_id)
            .returning('*')
            .first()
    }
}
