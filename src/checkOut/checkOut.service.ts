import { ICheckOutRepository } from './checkOut.repository'
import { Dependencies } from '../container'
import { Reservation } from '../models/reservation'
export interface ICheckOutService {
    checkOut(reservationID: string): Promise<Reservation>
}
export class CheckOutService implements ICheckOutService {
    checkOutRepository: ICheckOutRepository
    constructor({ checkOutRespository }: Dependencies<ICheckOutRepository>) {
        this.checkOutRepository = checkOutRespository
    }
    checkOut(reservationID:string) {
        return this.checkOutRepository.addCheckOutTime(reservationID, new Date())
    }
}
