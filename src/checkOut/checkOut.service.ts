import { sameDay } from '../checkIn/checkIn.utils'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { Reservation } from '../models/reservation'
import { ICheckOutRepository } from './checkOut.repository'
export interface ICheckOutService {
    checkOut(reservationID: string, date: Date): Promise<Reservation>
    getCheckoutCode(guest_id: string, date: Date): Promise<{ code: string }>
}
export class CheckOutService implements ICheckOutService {
    checkOutRepository: ICheckOutRepository
    constructor({ checkOutRespository }: Dependencies<ICheckOutRepository>) {
        this.checkOutRepository = checkOutRespository
    }
    async checkOut(reservationID: string, date: Date) {
        const reservation = await this.checkOutRepository.findReservationById(
            reservationID
        )
        if (!reservation) {
            throw new BadRequestError('Invalid ID')
        }
        if (!sameDay(date, reservation.check_out)) {
            throw new BadRequestError('Can not check out today.')
        }
        if (!reservation.check_in_enter_time) {
            throw new BadRequestError('You are not checked in.')
        }
        return this.checkOutRepository.addCheckOutTime(reservationID, date)
    }
    async getCheckoutCode(guest_id: string, date: Date) {
        const reservation = await this.checkOutRepository.findReservationToCheckOut(
            guest_id,
            date
        )
        if (!reservation) {
            throw new BadRequestError(
                'No reservation to check out on this date.'
            )
        }
        return { code: reservation.id }
    }
}
