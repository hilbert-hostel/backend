import { Dependencies } from '../container'
import { Guest } from '../models/guest'
import OtpModel, { Otp } from '../models/otp'
import RecordModel, { Record } from '../models/record'
import ReservationModel, { Reservation } from '../models/reservation'
import {
    IReservationRepository,
    ReservationWithRoom
} from '../reservation/reservation.repository'

export interface ICheckInRepository {
    getGuestReservation(
        guest_id: string,
        check_in: Date
    ): Promise<ReservationWithRoom>
    createOtp(
        reservation_id: string,
        password: string,
        reference_code: string
    ): Promise<Otp>
    getReservationOwner(reservation_id: string): Promise<Guest>
    getReservationOtp(reservation_id: string): Promise<Otp>
    createReservationRecord(
        reservation_id: string,
        photo: string,
        id_card_data: any
    ): Promise<Record>
    findReservationById(id: string): Promise<Reservation>
    addCheckInTime(reservation_id: string, time: Date): Promise<Reservation>
}

export class CheckInRepository implements ICheckInRepository {
    reservationRepository: IReservationRepository
    constructor({
        reservationRepository
    }: Dependencies<IReservationRepository>) {
        this.reservationRepository = reservationRepository
    }
    async getGuestReservation(guest_id: string, check_in: Date) {
        const reservation = await ReservationModel.query().findOne({
            guest_id,
            check_in
        })
        return this.reservationRepository.getReservationWithRoom(reservation.id)
    }
    async createOtp(
        reservation_id: string,
        password: string,
        reference_code: string
    ) {
        const otp = await OtpModel.query().findById(reservation_id)
        return !!otp
            ? OtpModel.query()
                  .updateAndFetchById(reservation_id, {
                      password,
                      reference_code
                  })
                  .execute()
            : OtpModel.query().insert({
                  id: reservation_id,
                  password,
                  reference_code
              })
    }

    getReservationOwner(reservation_id: string) {
        return ReservationModel.query()
            .innerJoinRelated('guest')
            .findById(reservation_id)
            .select('guest.*') as any
    }
    getReservationOtp(reservation_id: string) {
        return OtpModel.query().findById(reservation_id)
    }
    async createReservationRecord(
        reservation_id: string,
        photo: string,
        id_card_data: any
    ) {
        return RecordModel.query().insert({
            id: reservation_id,
            photo,
            id_card_data
        })
    }
    findReservationById(id: string): Promise<Reservation> {
        return ReservationModel.query().findById(id)
    }
    async addCheckInTime(reservation_id: string, time: Date) {
        return ReservationModel.query().patchAndFetchById(reservation_id, {
            check_in_enter_time: time
        })
    }
}
