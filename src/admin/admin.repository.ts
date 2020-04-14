import GuestModel, { Guest } from '../models/guest'
import ReservationModel from '../models/reservation'
import RoomModel, { Room } from '../models/room'
import StaffModel, { Staff } from '../models/staff'
import { CreateStaff, ReservationInfoDatabase } from './admin.interface'

export interface IAdminRespository {
    listReservations(from: Date, to: Date): Promise<ReservationInfoDatabase[]>
    findRoomsInReservation(reservation_id: string): Promise<Room[]>
    createStaff(input: CreateStaff): Promise<Staff>
    findStaff(input: Partial<Staff>): Promise<Staff>
    listGuests(page: number, size: number): Promise<Guest[]>
}

export class AdminRepository implements IAdminRespository {
    findRoomsInReservation(reservation_id: string) {
        return RoomModel.query()
            .withGraphJoined('beds', {
                joinOperation: 'rightJoin'
            })
            .modifyGraph('beds', (bed) => {
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
        return Promise.all(
            reservations.map(async (r) => {
                const rooms = await this.findRoomsInReservation(r.id)
                return {
                    ...r,
                    rooms
                } as ReservationInfoDatabase
            })
        )
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
}
