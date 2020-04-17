import moment from 'moment'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { Reservation } from '../models/reservation'
import { ICheckOutRepository } from './checkOut.repository'
export interface ICheckOutService {
    checkOut(reservationID: string, date: Date): Promise<Reservation>
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
        if (!this.validDate(date, reservation.check_out)) {
            throw new BadRequestError('Can not check out today.')
        }
        return this.checkOutRepository.addCheckOutTime(reservationID, date)
    }
    validDate(date: Date, checkOutDate: Date) {
        return moment(date).isSame(moment(checkOutDate), 'day')
    }
}
