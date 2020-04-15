import { Dependencies } from '../container'
import GuestModel, { Guest } from '../models/guest'
import ReservationModel, { ReservationWithGuest } from '../models/reservation'
import RoomModel, { Room } from '../models/room'
import StaffModel, { Staff } from '../models/staff'
import { IReservationRepository } from '../reservation/reservation.repository'
import { CreateStaff, ReservationInfoDatabase } from './admin.interface'

export interface IAdminRespository {
    listReservations(from: Date, to: Date): Promise<ReservationInfoDatabase[]>
    findRoomsInReservation(reservation_id: string): Promise<Room[]>
    createStaff(input: CreateStaff): Promise<Staff>
    findStaff(input: Partial<Staff>): Promise<Staff>
    listGuests(page: number, size: number): Promise<Guest[]>
    listCheckIns(page: number, size: number): Promise<ReservationWithGuest[]>
    listCheckOuts(page: number, size: number): Promise<ReservationWithGuest[]>
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
        return (await this.reservationRepository.mapRoomsToReservations(
            reservations
        )) as ReservationInfoDatabase[]
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
}
