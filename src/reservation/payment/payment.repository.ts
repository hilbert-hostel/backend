import TransactionModel, { Transaction } from '../../models/transaction'
import ReservationModel, { Reservation } from '../../models/reservation'
import RoomModel, { Room } from '../../models/room'

export interface IPaymentRepository {
    createTransaction(
        transaction_id: string,
        reservation_id: string,
        amount: number,
        method: string
    ): Promise<Transaction>
    completeTransaction(transaction_id: string): Promise<Transaction>
    deleteTransactionById(transaction_id: string): Promise<any>
    findReservationById(reservation_id: string): Promise<Reservation>
    findRoomsInReservationById(reservation_id: string): Promise<Room[]>
}

export class PaymentRepository implements IPaymentRepository {
    createTransaction(
        transaction_id: string,
        reservation_id: string,
        amount: number,
        method: string
    ) {
        return TransactionModel.query().insert({
            id: transaction_id,
            reservation_id,
            amount,
            method
        })
    }
    completeTransaction(transaction_id: string) {
        return TransactionModel.query().patchAndFetchById(transaction_id, {
            paid: true
        })
    }
    deleteTransactionById(transaction_id: string) {
        return TransactionModel.query().deleteById(transaction_id)
    }

    async findReservationById(reservation_id: string) {
        const result = await ReservationModel.query()
            .findById(reservation_id)
            .withGraphJoined('transaction')
        return result
    }
    findRoomsInReservationById(reservation_id: string) {
        return RoomModel.query()
            .withGraphJoined('beds', {
                joinOperation: 'rightJoin'
            })
            .modifyGraph('beds', bed => {
                bed.innerJoinRelated('reservations').where(
                    'reservations.id',
                    '=',
                    reservation_id
                )
            })
    }
}
